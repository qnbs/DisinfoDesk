
import {
  StoredAnalysis, StoredChat, StoredSatire, StoredMediaAnalysis
} from '../types';

const DB_NAME = 'DisinfoDesk_Vault';
const DB_VERSION = 3; // Incremented for Schema Upgrade
const CRYPTO_ALGO = 'AES-GCM';
const BROADCAST_CHANNEL = 'vault_sync_channel';

// --- Types ---

interface DBSchema {
  analyses: StoredAnalysis;
  media_analyses: StoredMediaAnalysis;
  chats: StoredChat;
  satires: StoredSatire;
  app_state: { key: string; value: string };
  // New Store for binary blobs (Images) to keep main stores light
  blob_storage: { id: string; data: Blob; mimeType: string; refCount: number }; 
}

type StoreName = keyof DBSchema;
type ChangeType = 'PUT' | 'DELETE' | 'CLEAR';

interface VaultEvent {
  type: ChangeType;
  store: StoreName;
  key?: string | IDBValidKey;
}

export interface StorageStats {
  usageBytes: number;
  recordCounts: Record<StoreName, number>;
  totalRecords: number;
  encrypted: boolean;
  compressionRatio: number;
}

/**
 * UTILITY: Native Compression Streams (GZIP)
 * Compresses stringified JSON into Uint8Array
 */
const compressData = async (data: unknown): Promise<ArrayBuffer> => {
  const jsonStr = JSON.stringify(data);
  const blob = new Blob([jsonStr]);
  const stream = blob.stream().pipeThrough(new CompressionStream('gzip'));
  return new Response(stream).arrayBuffer();
};

const decompressData = async (buffer: ArrayBuffer): Promise<unknown> => {
  const stream = new Response(buffer).body?.pipeThrough(new DecompressionStream('gzip'));
  if (!stream) throw new Error("Decompression stream failed");
  const blob = await new Response(stream).blob();
  const text = await blob.text();
  return JSON.parse(text);
};

/**
 * UTILITY: Web Crypto API (AES-GCM)
 */
class CryptoGuard {
  private key: CryptoKey | null = null;
  private readonly ivLen = 12;
  private static readonly KEY_DB_NAME = 'DisinfoDesk_CryptoKeys';
  private static readonly KEY_DB_VERSION = 1;
  private static readonly KEY_STORE = 'master_keys';
  private static readonly KEY_ID = 'vault_master_key';

  /** Store the master key JWK in a dedicated IndexedDB (not localStorage). */
  private async openKeyDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(CryptoGuard.KEY_DB_NAME, CryptoGuard.KEY_DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(CryptoGuard.KEY_STORE)) {
          db.createObjectStore(CryptoGuard.KEY_STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  private async getStoredKeyJwk(): Promise<JsonWebKey | null> {
    const db = await this.openKeyDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CryptoGuard.KEY_STORE, 'readonly');
      const get = tx.objectStore(CryptoGuard.KEY_STORE).get(CryptoGuard.KEY_ID);
      get.onsuccess = () => resolve((get.result as { id: string; jwk: JsonWebKey } | undefined)?.jwk ?? null);
      get.onerror = () => reject(get.error);
    });
  }

  private async setStoredKeyJwk(jwk: JsonWebKey): Promise<void> {
    const db = await this.openKeyDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(CryptoGuard.KEY_STORE, 'readwrite');
      tx.objectStore(CryptoGuard.KEY_STORE).put({ id: CryptoGuard.KEY_ID, jwk });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async init() {
    if (this.key) return;

    // Migrate: if legacy key exists in localStorage, move it to IndexedDB
    const legacyRaw = localStorage.getItem('vault_master_key');
    if (legacyRaw) {
      const jwk = JSON.parse(legacyRaw) as JsonWebKey;
      await this.setStoredKeyJwk(jwk);
      localStorage.removeItem('vault_master_key');
    }

    // Try to load from IndexedDB
    const storedJwk = await this.getStoredKeyJwk();
    if (storedJwk) {
      this.key = await window.crypto.subtle.importKey(
        'jwk', storedJwk, { name: CRYPTO_ALGO }, false, ['encrypt', 'decrypt']
      );
    } else {
      // Generate new master key
      this.key = await window.crypto.subtle.generateKey(
        { name: CRYPTO_ALGO, length: 256 }, true, ['encrypt', 'decrypt']
      );
      const exported = await window.crypto.subtle.exportKey('jwk', this.key);
      await this.setStoredKeyJwk(exported);
    }
  }

  async encrypt(data: unknown): Promise<{ iv: Uint8Array, cipher: ArrayBuffer, isEncrypted: boolean }> {
    await this.init();
    if (!this.key) throw new Error("Crypto Init Failed");
    
    // Auto-compress before encrypting
    const compressed = await compressData(data);
    const iv = window.crypto.getRandomValues(new Uint8Array(this.ivLen));
    
    const cipher = await window.crypto.subtle.encrypt(
      { name: CRYPTO_ALGO, iv },
      this.key,
      compressed
    );

    return { iv, cipher, isEncrypted: true };
  }

  async decrypt(record: Record<string, unknown>): Promise<unknown> {
    if (!record || !record.isEncrypted) return record; // Legacy data pass-through
    await this.init();
    if (!this.key) throw new Error("Crypto Init Failed");

    try {
      const decrypted = await window.crypto.subtle.decrypt(
        { name: CRYPTO_ALGO, iv: record.iv as BufferSource },
        this.key,
        record.cipher as BufferSource
      );
      return await decompressData(decrypted);
    } catch (e) {
      if (import.meta.env.DEV) {
          console.error("Decryption failed. Data corruption or wrong key.", e);
      }
      throw new Error("Vault Access Denied: Decryption Failed");
    }
  }
}

/**
 * THE VAULT SERVICE
 * Sophisticated Wrapper for IndexedDB
 */
class DatabaseService {
  private db: IDBDatabase | null = null;
  private pendingOpen: Promise<IDBDatabase> | null = null;
  private crypto = new CryptoGuard();
  private channel = new BroadcastChannel(BROADCAST_CHANNEL);
  private subscribers = new Set<(event: VaultEvent) => void>();

  constructor() {
    // Listen for changes from other tabs
    this.channel.onmessage = (msg: MessageEvent<VaultEvent>) => {
      this.notifySubscribers(msg.data);
    };
  }

  // --- Connection & Migration ---

  private async open(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.pendingOpen) return this.pendingOpen;

    this.pendingOpen = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const _tx = (event.target as IDBOpenDBRequest).transaction;

        // V1 -> V2 Stores
        const stores = ['analyses', 'media_analyses', 'chats', 'satires'];
        stores.forEach(name => {
           if (!db.objectStoreNames.contains(name)) {
             const store = db.createObjectStore(name, { keyPath: 'id' });
             store.createIndex('timestamp', 'timestamp', { unique: false });
           }
        });

        if (!db.objectStoreNames.contains('app_state')) {
            db.createObjectStore('app_state', { keyPath: 'key' });
        }

        // V3 Upgrade: Blob Storage for efficient image handling
        if (!db.objectStoreNames.contains('blob_storage')) {
            db.createObjectStore('blob_storage', { keyPath: 'id' });
        }

        // Migration Logic (if needed in future versions)
        // e.g., if (event.oldVersion < 3) { ... migrate data structure ... }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        
        this.db.onclose = () => {
            this.db = null;
            this.pendingOpen = null;
        };
        
        this.db.onversionchange = () => {
            this.db?.close();
            this.db = null;
            this.pendingOpen = null;
        };

        resolve(this.db);
      };

      request.onerror = (event) => {
        this.db = null;
        this.pendingOpen = null;
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.pendingOpen;
  }

  // --- Pipeline Operations (Encryption/Compression Middleware) ---

  private async executeTransaction<T>(
    storeNames: StoreName[], 
    mode: IDBTransactionMode, 
    callback: (stores: Record<StoreName, IDBObjectStore>) => Promise<T> | T
  ): Promise<T> {
    const db = await this.open();
    
    return new Promise<T>((resolve, reject) => {
      const tx = db.transaction(storeNames, mode);
      const stores = {} as Record<StoreName, IDBObjectStore>;
      storeNames.forEach(name => stores[name] = tx.objectStore(name));

      // Execute callback and handle result
      Promise.resolve(callback(stores))
        .then(result => {
          // Commit wrapper for readwrite
          if (mode === 'readwrite') {
            tx.oncomplete = () => resolve(result);
          } else {
            resolve(result); // readonly usually doesn't need to wait for complete
          }
        })
        .catch(e => {
          tx.abort();
          reject(e);
        });

      tx.onerror = () => reject(tx.error);
    });
  }

  // --- Subscriptions (Reactivity) ---

  public subscribe(callback: (event: VaultEvent) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(event: VaultEvent) {
    this.subscribers.forEach(cb => cb(event));
  }

  private broadcast(event: VaultEvent) {
    this.channel.postMessage(event);
    this.notifySubscribers(event);
  }

  // --- CRUD (Augmented) ---

  /**
   * High-Performance Iterator
   * Uses Async Generators to stream data instead of loading all into RAM.
   * Automatically handles decryption.
   */
  async *streamAll<T>(storeName: StoreName): AsyncGenerator<T, void, unknown> {
    const db = await this.open();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    // Use index for chronological order if available
    const request = store.indexNames.contains('timestamp') 
        ? store.index('timestamp').openCursor(null, 'prev')
        : store.openCursor();

    let cursorRequestResolve: (value: IDBCursorWithValue | null) => void;
    let cursorRequestReject: (reason?: Error | null) => void;

    request.onsuccess = (e) => cursorRequestResolve((e.target as IDBRequest).result);
    request.onerror = (e) => cursorRequestReject((e.target as IDBRequest).error);

    while (true) {
        const promise = new Promise<IDBCursorWithValue | null>((resolve, reject) => {
            cursorRequestResolve = resolve;
            cursorRequestReject = reject;
        });
        
        // Note: The first yield waits for onsuccess above. Subsequent loops wait for .continue()
        const cursor = await promise;
        if (!cursor) break;

        const rawData = cursor.value;
        const decrypted = await this.crypto.decrypt(rawData);
        
        yield decrypted as T;
        
        // Prepare promise for next iteration before calling continue
        const _nextPromise = new Promise<IDBCursorWithValue | null>((resolve, reject) => {
            cursorRequestResolve = resolve;
            cursorRequestReject = reject;
        });
        
        cursor.continue();
        
        // Await the next result immediately to keep generator mechanics sound
        // However, logic above simplifies this by creating promise inside loop.
        // Actually, for simple implementation:
        // We need to re-assign the handlers because continue() triggers onsuccess again.
        request.onsuccess = (e) => cursorRequestResolve((e.target as IDBRequest).result);
    }
  }

  /**
   * Traditional GetAll (Buffered)
   * Augmented with Decryption
   */
  async getAll<T>(storeName: StoreName): Promise<T[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.indexNames.contains('timestamp') ? store.index('timestamp') : store;
      // Get most recent first
      const request = store.indexNames.contains('timestamp') 
        ? (index as IDBIndex).openCursor(null, 'prev') 
        : store.openCursor();
      
      const results: Record<string, unknown>[] = [];

      request.onsuccess = async (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          // Bulk Decrypt
          try {
             const decrypted = await Promise.all(results.map(r => this.crypto.decrypt(r)));
             resolve(decrypted as T[]);
          } catch (e) {
             reject(e);
          }
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: StoreName, key: string): Promise<T | undefined> {
    const raw = await this.executeTransaction<unknown>([storeName], 'readonly', (stores) => {
      return new Promise((resolve, reject) => {
          const req = stores[storeName].get(key);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
      });
    });
    
    if (!raw) return undefined;
    return this.crypto.decrypt(raw as Record<string, unknown>) as Promise<T>;
  }

  /**
   * Secure Put
   * Automatically encrypts data before storage.
   */
  async put<T>(storeName: StoreName, value: T): Promise<void> {
    // Encrypt payload (except app_state which is simple key-val)
    let payload = value;
    if (storeName !== 'app_state') {
        payload = await this.crypto.encrypt(value) as unknown as T;
        // Restore ID for indexing (IndexedDB needs the key path visible)
        (payload as Record<string, unknown>).id = (value as Record<string, unknown>).id;
        if ((value as Record<string, unknown>).timestamp) (payload as Record<string, unknown>).timestamp = (value as Record<string, unknown>).timestamp;
    }

    await this.executeTransaction([storeName], 'readwrite', (stores) => {
      stores[storeName].put(payload);
    });

    this.broadcast({ type: 'PUT', store: storeName, key: (value as Record<string, unknown>).id as string });
  }

  async delete(storeName: StoreName, key: string): Promise<void> {
    await this.executeTransaction([storeName], 'readwrite', (stores) => {
      stores[storeName].delete(key);
    });
    this.broadcast({ type: 'DELETE', store: storeName, key });
  }

  async deleteBatch(storeName: StoreName, keys: string[]): Promise<void> {
    await this.executeTransaction([storeName], 'readwrite', (stores) => {
      keys.forEach(key => stores[storeName].delete(key));
    });
    this.broadcast({ type: 'DELETE', store: storeName });
  }

  async clear(storeName: StoreName): Promise<void> {
    await this.executeTransaction([storeName], 'readwrite', (stores) => {
      stores[storeName].clear();
    });
    this.broadcast({ type: 'CLEAR', store: storeName });
  }

  // --- Blob Storage Optimization (Binary) ---
  
  async saveImageBlob(id: string, base64: string): Promise<void> {
      // Convert base64 to Blob to save roughly 33% space and parsing time
      const byteString = atob(base64.split(',')[1]);
      const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      await this.executeTransaction(['blob_storage'], 'readwrite', (stores) => {
          stores['blob_storage'].put({ id, data: blob, mimeType: mimeString, refCount: 1 });
      });
  }

  // --- Statistics & Diagnostics ---

  async getStorageStats(): Promise<StorageStats> {
    const stores: StoreName[] = ['analyses', 'media_analyses', 'chats', 'satires', 'app_state', 'blob_storage'];
    const stats: StorageStats = {
      usageBytes: 0,
      recordCounts: { analyses: 0, media_analyses: 0, chats: 0, satires: 0, app_state: 0, blob_storage: 0 } as Record<string, number>,
      totalRecords: 0,
      encrypted: true,
      compressionRatio: 0
    };

    const db = await this.open();
    const tx = db.transaction(stores, 'readonly');

    let totalRawBytes = 0;
    let totalStoredBytes = 0;

    await Promise.all(stores.map(storeName => new Promise<void>((resolve) => {
        const store = tx.objectStore(storeName);
        
        // Count
        const countReq = store.count();
        countReq.onsuccess = () => {
            stats.recordCounts[storeName] = countReq.result;
            stats.totalRecords += countReq.result;
        };

        // Estimate Size (Sampling first 10 for performance)
        // In a real 'state-of-the-art' app, we might maintain a running metadata counter.
        // Here we approximate.
        const cursorReq = store.openCursor();
        let samples = 0;
        
        cursorReq.onsuccess = (e) => {
            const cursor = (e.target as IDBRequest).result;
            if (cursor && samples < 20) {
                const val = cursor.value;
                
                // Stored Size
                const json = JSON.stringify(val);
                totalStoredBytes += json.length; 
                
                // Estimating Raw Size (if encrypted)
                if (val.isEncrypted && val.cipher) {
                    // Rough estimation of decompression ratio (usually 3x-5x for text)
                    totalRawBytes += (val.cipher.byteLength * 4); 
                } else {
                    totalRawBytes += json.length;
                }
                
                samples++;
                cursor.continue();
            } else {
                resolve();
            }
        };
    })));

    // Extrapolate total size based on samples
    if (stats.totalRecords > 0) {
       // Simple heuristic for demo purposes
       stats.usageBytes = totalStoredBytes * (stats.totalRecords / Math.max(1, 20)); // Approximate total
       stats.compressionRatio = totalRawBytes > 0 ? parseFloat((totalStoredBytes / totalRawBytes).toFixed(2)) : 1;
    }

    return stats;
  }

  // --- Export/Import ---

  async exportFullDatabase(): Promise<Blob> {
    // We use getAll here, but in a massive DB we would use streamAll and stream the JSON output
    // to avoid memory crashes. For this implementation, standard getAll is sufficient but let's decrypt.
    const data = {
      analyses: await this.getAll('analyses'),
      media_analyses: await this.getAll('media_analyses'),
      chats: await this.getAll('chats'),
      satires: await this.getAll('satires'),
      settings: await this.getAll('app_state'),
      meta: {
          timestamp: Date.now(),
          version: DB_VERSION,
          app: 'DisinfoDesk_Vault',
          schema: 'v3_secure'
      }
    };
    return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  }

  // --- Redux Persist Interface ---
  public reduxStorage = {
    getItem: async (key: string): Promise<string | null> => {
      const res = await this.get<{ key: string; value: string }>('app_state', key);
      return res ? res.value : null;
    },
    setItem: async (key: string, value: string): Promise<void> => {
      await this.put('app_state', { key, value });
    },
    removeItem: async (key: string): Promise<void> => {
      await this.delete('app_state', key);
    },
  };

  // --- Specific Helpers ---
  async saveAnalysis(item: StoredAnalysis) { return this.put('analyses', item); }
  async getAnalysis(id: string) { return this.get<StoredAnalysis>('analyses', id); }
  async saveMediaAnalysis(item: StoredMediaAnalysis) { return this.put('media_analyses', item); }
  async getMediaAnalysis(id: string) { return this.get<StoredMediaAnalysis>('media_analyses', id); }
  async saveChat(item: StoredChat) { return this.put('chats', item); }
  async saveSatire(item: StoredSatire) { return this.put('satires', item); }
}

export const dbService = new DatabaseService();
