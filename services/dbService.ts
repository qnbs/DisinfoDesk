import {
  StoredAnalysis, StoredChat, StoredSatire, StoredMediaAnalysis
} from '../types';

// === CONFIGURATION ===
const DB_NAME = 'DisinfoDesk_Vault';
const DB_VERSION = 4; // Schema v4: Compound Indexes + TTL + Performance Optimization
const CRYPTO_ALGO = 'AES-GCM';
const BROADCAST_CHANNEL = 'vault_sync_channel';
const TTL_DEFAULT = 30 * 24 * 60 * 60 * 1000; // 30 days default TTL
const QUOTA_WARNING_THRESHOLD = 0.8; // Warn at 80% quota usage

// Cache Configuration
const CACHE_MAX_SIZE = 100; // LRU cache entries
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Batch Operation Configuration
const BATCH_DELAY = 50; // ms - time to wait before flushing batch
const BATCH_MAX_SIZE = 20; // max items before auto-flush

// === TYPES ===

interface DBSchema {
  analyses: StoredAnalysis;
  media_analyses: StoredMediaAnalysis;
  chats: StoredChat;
  satires: StoredSatire;
  app_state: { key: string; value: string };
  blob_storage: { id: string; data: Blob; mimeType: string; refCount: number }; 
}

type StoreName = keyof DBSchema;

export interface StorageStats {
  usageBytes: number;
  recordCounts: Record<StoreName, number>;
  totalRecords: number;
  encrypted: boolean;
  compressionRatio: number;
  quotaUsage?: number;
  quotaAvailable?: number;
  indexUsage?: Record<string, number>;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: 'asc' | 'desc';
  startKey?: string;
  endKey?: string;
}

export interface PerformanceMetrics {
  transactionCount: number;
  averageTransactionTime: number;
  cacheHitRate: number;
  lastCleanup: number;
  expiredRecords: number;
}

interface StoredEncryptedData {
  iv: ArrayBuffer;
  cipher: ArrayBuffer;
  isEncrypted: true;
}

interface CacheEntry {
  data: unknown;
  timestamp: number;
  hits: number;
  size: number;
}

interface BatchOperation {
  store: StoreName;
  data: unknown;
  resolve: () => void;
  reject: (e: Error) => void;
}

// === COMPRESSION UTILITIES ===

const compressData = async (data: unknown): Promise<ArrayBuffer> => {
  const jsonStr = JSON.stringify(data);
  const blob = new Blob([jsonStr]);
  const stream = blob.stream().pipeThrough(new CompressionStream('gzip'));
  return new Response(stream).arrayBuffer();
};

const decompressData = async (buffer: ArrayBuffer): Promise<unknown> => {
  const blob = new Blob([buffer]);
  const stream = blob.stream().pipeThrough(new DecompressionStream('gzip'));
  const decompressed = await new Response(stream).text();
  return JSON.parse(decompressed);
};

// === CRYPTO GUARD (Separate Key Storage) ===

class CryptoGuard {
  private key: CryptoKey | null = null;
  private readonly keyDB = 'DisinfoDesk_CryptoKeys';
  private readonly keyStore = 'keys';
  private readonly masterKeyId = 'master_encryption_key';

  async init() {
    if (this.key) return;
    
    // Open dedicated key storage database
    const db = await this.openKeyDB();
    
    // Try to load existing key
    const existingKey = await this.loadKey(db);
    
    if (existingKey) {
      this.key = existingKey;
    } else {
      // Generate new master key
      this.key = await window.crypto.subtle.generateKey(
        { name: CRYPTO_ALGO, length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      await this.saveKey(db, this.key);
    }
  }

  private async openKeyDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.keyDB, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.keyStore)) {
          db.createObjectStore(this.keyStore);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async loadKey(db: IDBDatabase): Promise<CryptoKey | null> {
    return new Promise((resolve, reject) => {
      const tx = db.transaction([this.keyStore], 'readonly');
      const store = tx.objectStore(this.keyStore);
      const request = store.get(this.masterKeyId);
      
      request.onsuccess = async () => {
        if (!request.result) {
          // Migration from localStorage (legacy)
          const legacyKey = localStorage.getItem('disinfoDesk_masterKey');
          if (legacyKey) {
            try {
              const jwk = JSON.parse(atob(legacyKey));
              const key = await window.crypto.subtle.importKey(
                'jwk', jwk, { name: CRYPTO_ALGO }, true, ['encrypt', 'decrypt']
              );
              await this.saveKey(db, key);
              localStorage.removeItem('disinfoDesk_masterKey');
              resolve(key);
              return;
            } catch (e) {
              console.warn('Legacy key migration failed', e);
            }
          }
          resolve(null);
        } else {
          const jwk = request.result;
          const key = await window.crypto.subtle.importKey(
            'jwk', jwk, { name: CRYPTO_ALGO }, true, ['encrypt', 'decrypt']
          );
          resolve(key);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async saveKey(db: IDBDatabase, key: CryptoKey): Promise<void> {
    const jwk = await window.crypto.subtle.exportKey('jwk', key);
    return new Promise((resolve, reject) => {
      const tx = db.transaction([this.keyStore], 'readwrite');
      const store = tx.objectStore(this.keyStore);
      const request = store.put(jwk, this.masterKeyId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async encrypt(data: unknown): Promise<StoredEncryptedData> {
    await this.init();
    if (!this.key) throw new Error('Encryption key not initialized');
    
    const compressed = await compressData(data);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const cipher = await window.crypto.subtle.encrypt(
      { name: CRYPTO_ALGO, iv },
      this.key,
      compressed
    );
    
    return { iv: iv.buffer, cipher, isEncrypted: true };
  }

  async decrypt(record: Record<string, unknown>): Promise<unknown> {
    if (!record || !record.isEncrypted) return record; // Legacy unencrypted data
    
    await this.init();
    if (!this.key) throw new Error('Decryption key not initialized');
    
    try {
      const decrypted = await window.crypto.subtle.decrypt(
        { name: CRYPTO_ALGO, iv: record.iv as BufferSource },
        this.key,
        record.cipher as BufferSource
      );
      return await decompressData(decrypted);
    } catch (e) {
      console.error('Decryption failed', e);
      throw new Error('Vault Access Denied: Decryption Failed');
    }
  }
}

// === DATABASE SERVICE (State-of-the-Art Implementation) ===

class DatabaseService {
  private db: IDBDatabase | null = null;
  private pendingOpen: Promise<IDBDatabase> | null = null;
  private cryptoGuard = new CryptoGuard();
  private broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL);
  private subscribers: Array<() => void> = [];

  // === LRU CACHE ===
  private cache = new Map<string, CacheEntry>();
  private cacheSize = 0; // Total bytes in cache

  // === BATCH QUEUE ===
  private batchQueue: BatchOperation[] = [];
  private batchTimer: ReturnType<typeof setTimeout> | null = null;

  // === PERFORMANCE METRICS ===
  private metrics = {
    transactionCount: 0,
    totalTransactionTime: 0,
    cacheHits: 0,
    cacheMisses: 0,
    lastCleanup: Date.now(),
    expiredRecords: 0,
    indexUsage: new Map<string, number>(),
  };

  constructor() {
    // Cross-tab synchronization
    this.broadcastChannel.onmessage = () => {
      this.invalidateCache(); // Clear cache on external updates
      this.notifySubscribers();
    };
    
    // Periodic cleanup of expired records
    this.scheduleCleanup();
    
    // Cache eviction on memory pressure
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      setInterval(() => this.checkMemoryPressure(), 60000); // Every minute
    }
  }

  // === CONNECTION MANAGEMENT ===

  private async ensureDBOpen(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.pendingOpen) return this.pendingOpen;

    this.pendingOpen = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;

        // === SCHEMA MIGRATIONS ===
        
        // V1->V2: Core Stores with Enhanced Indexes
        const stores = ['analyses', 'media_analyses', 'chats', 'satires'];
        stores.forEach(name => {
          if (!db.objectStoreNames.contains(name)) {
            const store = db.createObjectStore(name, { keyPath: 'id' });
            // Single timestamp index for backward compat
            store.createIndex('timestamp', 'timestamp', { unique: false });
            // Compound index for efficient range queries
            store.createIndex('timestamp_id', ['timestamp', 'id'], { unique: true });
            // TTL index for automatic cleanup
            store.createIndex('expiresAt', 'expiresAt', { unique: false });
          } else if (oldVersion < 4) {
            // Upgrade existing stores
            const tx = (event.target as IDBOpenDBRequest).transaction;
            const store = tx?.objectStore(name);
            if (store) {
              if (!store.indexNames.contains('timestamp_id')) {
                store.createIndex('timestamp_id', ['timestamp', 'id'], { unique: true });
              }
              if (!store.indexNames.contains('expiresAt')) {
                store.createIndex('expiresAt', 'expiresAt', { unique: false });
              }
            }
          }
        });

        // App State Store
        if (!db.objectStoreNames.contains('app_state')) {
          db.createObjectStore('app_state', { keyPath: 'key' });
        }

        // V3: Blob Storage (images)
        if (!db.objectStoreNames.contains('blob_storage')) {
          const blobStore = db.createObjectStore('blob_storage', { keyPath: 'id' });
          blobStore.createIndex('refCount', 'refCount', { unique: false });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.pendingOpen = null;
        resolve(this.db);
      };

      request.onerror = () => {
        this.pendingOpen = null;
        reject(request.error);
      };
    });

    return this.pendingOpen;
  }

  // === TRANSACTION EXECUTOR ===

  private async executeTransaction<T>(
    storeNames: StoreName[],
    mode: IDBTransactionMode,
    callback: (stores: IDBObjectStore[]) => Promise<T>
  ): Promise<T> {
    const db = await this.ensureDBOpen();
    const tx = db.transaction(storeNames, mode);
    const stores = storeNames.map(name => tx.objectStore(name));
    
    // Execute callback
    const result = await callback(stores);
    
    // Wait for transaction completion
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(new Error('Transaction aborted'));
    });
    
    return result;
  }

  // === RETRY LOGIC (Exponential Backoff) ===

  private async retryTransaction<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 100
  ): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries - 1) throw error;
        
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`Transaction retry ${attempt + 1}/${maxRetries} in ${delay}ms`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }

  // === PERFORMANCE MONITORING ===

  private async measureTransaction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.metrics.transactionCount++;
      this.metrics.totalTransactionTime += duration;
      
      if (duration > 100) {
        console.warn(`Slow transaction: ${name} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      console.error(`Transaction failed: ${name}`, error);
      throw error;
    }
  }

  // === LRU CACHE ===

  private getCacheKey(store: StoreName, id: string): string {
    return `${store}:${id}`;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.metrics.cacheMisses++;
      return null;
    }
    
    // Check TTL
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      this.cacheSize -= entry.size;
      this.metrics.cacheMisses++;
      return null;
    }
    
    entry.hits++;
    this.metrics.cacheHits++;
    
    // Move to end (LRU)
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    return entry.data as T;
  }

  private setInCache(key: string, data: unknown): void {
    const size = JSON.stringify(data).length;
    
    // LRU eviction if needed
    while (this.cache.size >= CACHE_MAX_SIZE) {
      const firstKey = this.cache.keys().next().value as string | undefined;
      if (!firstKey) break; // Safety check
      
      const firstEntry = this.cache.get(firstKey);
      this.cache.delete(firstKey);
      if (firstEntry) this.cacheSize -= firstEntry.size;
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0,
      size,
    });
    this.cacheSize += size;
  }

  private invalidateCache(store?: StoreName, id?: string): void {
    if (store && id) {
      const key = this.getCacheKey(store, id);
      const entry = this.cache.get(key);
      if (entry) {
        this.cache.delete(key);
        this.cacheSize -= entry.size;
      }
    } else if (store) {
      for (const [key, entry] of this.cache.entries()) {
        if (key.startsWith(`${store}:`)) {
          this.cache.delete(key);
          this.cacheSize -= entry.size;
        }
      }
    } else {
      this.cache.clear();
      this.cacheSize = 0;
    }
  }

  // === CRUD OPERATIONS (Cache-Aware) ===

  async get<T>(storeName: StoreName, id: string): Promise<T | undefined> {
    // Check cache first
    const cacheKey = this.getCacheKey(storeName, id);
    const cached = this.getFromCache<T>(cacheKey);
    if (cached) return cached;
    
    return this.measureTransaction(`get_${storeName}`, async () => {
      return this.executeTransaction([storeName], 'readonly', async (stores) => {
        const store = stores[0];
        const data = await new Promise<StoredEncryptedData | undefined>((resolve, reject) => {
          const req = store.get(id);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
        
        if (!data) return undefined;
        
        const decrypted = await this.cryptoGuard.decrypt(data as unknown as Record<string, unknown>) as T;
        
        // Cache the result
        this.setInCache(cacheKey, decrypted);
        
        return decrypted;
      });
    });
  }

  async put<T>(storeName: StoreName, data: T): Promise<void> {
    // Add TTL if not present
    const record = data as Record<string, unknown>;
    const dataWithTTL = {
      ...data,
      timestamp: (record.timestamp as number) || Date.now(),
      expiresAt: (record.expiresAt as number) || (Date.now() + TTL_DEFAULT),
    };
    
    await this.retryTransaction(async () => {
      const encrypted = await this.cryptoGuard.encrypt(dataWithTTL);
      
      await this.measureTransaction(`put_${storeName}`, async () => {
        await this.executeTransaction([storeName], 'readwrite', async (stores) => {
          const store = stores[0];
          await new Promise<void>((resolve, reject) => {
            const req = store.put(encrypted);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
          });
        });
      });
    });
    
    // Invalidate cache
    const id = (data as Record<string, unknown>).id as string | undefined;
    if (id) {
      this.invalidateCache(storeName, id);
    }
    
    // Notify other tabs
    this.broadcastChannel.postMessage({ storeName, op: 'put' });
  }

  async delete(storeName: StoreName, id: string): Promise<void> {
    await this.retryTransaction(async () => {
      await this.measureTransaction(`delete_${storeName}`, async () => {
        await this.executeTransaction([storeName], 'readwrite', async (stores) => {
          const store = stores[0];
          await new Promise<void>((resolve, reject) => {
            const req = store.delete(id);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
          });
        });
      });
    });
    
    this.invalidateCache(storeName, id);
    this.broadcastChannel.postMessage({ storeName, op: 'delete', id });
  }

  // === BATCH OPERATIONS ===

  async putBatch(storeName: StoreName, data: unknown): Promise<void> {
    return new Promise((resolve, reject) => {
      this.batchQueue.push({ store: storeName, data, resolve, reject });
      
      // Auto-flush if batch is full
      if (this.batchQueue.length >= BATCH_MAX_SIZE) {
        this.flushBatch();
      } else if (!this.batchTimer) {
        // Schedule flush
        this.batchTimer = setTimeout(() => this.flushBatch(), BATCH_DELAY);
      }
    });
  }

  private async flushBatch(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    if (this.batchQueue.length === 0) return;
    
    const batch = [...this.batchQueue];
    this.batchQueue = [];
    
    // Group by store
    const byStore = new Map<StoreName, BatchOperation[]>();
    for (const op of batch) {
      if (!byStore.has(op.store)) {
        byStore.set(op.store, []);
      }
      byStore.get(op.store)!.push(op);
    }
    
    // Execute batched transactions
    for (const [storeName, ops] of byStore.entries()) {
      try {
        await this.measureTransaction(`batch_${storeName}`, async () => {
          await this.executeTransaction([storeName], 'readwrite', async (stores) => {
            const store = stores[0];
            
            for (const op of ops) {
              try {
                const dataWithTTL = {
                  ...(op.data as object),
                  timestamp: (op.data as Record<string, unknown>).timestamp as number || Date.now(),
                  expiresAt: (op.data as Record<string, unknown>).expiresAt as number || (Date.now() + TTL_DEFAULT),
                };
                const encrypted = await this.cryptoGuard.encrypt(dataWithTTL);
                
                await new Promise<void>((resolve, reject) => {
                  const req = store.put(encrypted);
                  req.onsuccess = () => resolve();
                  req.onerror = () => reject(req.error);
                });
                
                op.resolve();
              } catch (err) {
                op.reject(err as Error);
              }
            }
          });
        });
      } catch (error) {
        ops.forEach(op => op.reject(error as Error));
      }
    }
    
    this.broadcastChannel.postMessage({ op: 'batch_flush', count: batch.length });
  }

  // === STREAMING (Memory-Efficient) ===

  async *streamAll<T>(storeName: StoreName): AsyncGenerator<T> {
    await this.ensureDBOpen();
    
    const items: T[] = [];
    await this.executeTransaction([storeName], 'readonly', async (stores) => {
      const store = stores[0];
      
      // Use compound index if available for better performance
      const indexName = store.indexNames.contains('timestamp_id') ? 'timestamp_id' : 'timestamp';
      const source = store.indexNames.contains(indexName) ? store.index(indexName) : store;
      const request = source.openCursor(null, 'prev');
      
      // Track index usage
      this.metrics.indexUsage.set(indexName, (this.metrics.indexUsage.get(indexName) || 0) + 1);
      
      await new Promise<void>((resolve, reject) => {
        request.onsuccess = async () => {
          const cursor = request.result;
          if (!cursor) {
            resolve();
            return;
          }
          
          const decrypted = await this.cryptoGuard.decrypt(cursor.value as Record<string, unknown>) as T;
          items.push(decrypted);
          cursor.continue();
        };
        request.onerror = () => reject(request.error);
      });
    });
    
    for (const item of items) {
      yield item;
    }
  }

  async getAll<T>(storeName: StoreName): Promise<T[]> {
    const items: T[] = [];
    for await (const item of this.streamAll<T>(storeName)) {
      items.push(item);
    }
    return items;
  }

  // === PAGINATED QUERIES ===

  async query<T>(
    storeName: StoreName,
    options: QueryOptions = {}
  ): Promise<{ items: T[]; hasMore: boolean; nextKey?: string }> {
    const { limit = 20, offset = 0, orderBy = 'desc', startKey, endKey } = options;
    const items: T[] = [];
    let skipped = 0;
    let lastKey: string | undefined;
    
    await this.executeTransaction([storeName], 'readonly', async (stores) => {
      const store = stores[0];
      
      // Use compound index for better performance
      const indexName = store.indexNames.contains('timestamp_id') ? 'timestamp_id' : 'timestamp';
      const index = store.indexNames.contains(indexName) ? store.index(indexName) : store;
      
      // Track index usage
      this.metrics.indexUsage.set(indexName, (this.metrics.indexUsage.get(indexName) || 0) + 1);
      
      let range: IDBKeyRange | undefined;
      if (startKey && endKey) {
        range = IDBKeyRange.bound(startKey, endKey);
      } else if (startKey) {
        range = IDBKeyRange.lowerBound(startKey);
      } else if (endKey) {
        range = IDBKeyRange.upperBound(endKey);
      }
      
      const direction = orderBy === 'desc' ? 'prev' : 'next';
      const request = index.openCursor(range, direction);
      
      await new Promise<void>((resolve, reject) => {
        request.onsuccess = async () => {
          const cursor = request.result;
          if (!cursor) {
            resolve();
            return;
          }
          
          // Skip offset
          if (skipped < offset) {
            skipped++;
            cursor.continue();
            return;
          }
          
          // Check limit
          if (items.length >= limit) {
            lastKey = cursor.key as string;
            resolve();
            return;
          }
          
          // Decrypt and add
          const decrypted = await this.cryptoGuard.decrypt(cursor.value as Record<string, unknown>) as T;
          items.push(decrypted);
          lastKey = cursor.key as string;
          
          cursor.continue();
        };
        request.onerror = () => reject(request.error);
      });
    });
    
    return {
      items,
      hasMore: items.length === limit,
      nextKey: lastKey,
    };
  }

  // === TTL CLEANUP ===

  private scheduleCleanup(): void {
    setInterval(async () => {
      await this.cleanupExpiredRecords();
    }, 60 * 60 * 1000); // Every hour
  }

  async cleanupExpiredRecords(): Promise<number> {
    let expiredCount = 0;
    const now = Date.now();
    
    const stores: StoreName[] = ['analyses', 'media_analyses', 'chats', 'satires'];
    
    for (const storeName of stores) {
      await this.executeTransaction([storeName], 'readwrite', async (stores) => {
        const store = stores[0];
        
        if (!store.indexNames.contains('expiresAt')) return;
        
        const index = store.index('expiresAt');
        const range = IDBKeyRange.upperBound(now);
        const request = index.openCursor(range);
        
        await new Promise<void>((resolve, reject) => {
          request.onsuccess = () => {
            const cursor = request.result;
            if (cursor) {
              cursor.delete();
              expiredCount++;
              cursor.continue();
            } else {
              resolve();
            }
          };
          request.onerror = () => reject(request.error);
        });
      });
    }
    
    this.metrics.expiredRecords += expiredCount;
    this.metrics.lastCleanup = now;
    
    if (expiredCount > 0) {
      console.warn(`TTL Cleanup: Removed ${expiredCount} expired records`);
      this.broadcastChannel.postMessage({ type: 'cleanup', count: expiredCount });
    }
    
    return expiredCount;
  }

  // === QUOTA MANAGEMENT ===

  async checkQuota(): Promise<{ usage: number; available: number; percentage: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const available = estimate.quota || 0;
      const percentage = available > 0 ? usage / available : 0;
      
      if (percentage > QUOTA_WARNING_THRESHOLD) {
        console.warn(`⚠️ Storage quota: ${(percentage * 100).toFixed(1)}% used (${(usage / 1024 / 1024).toFixed(2)} MB / ${(available / 1024 / 1024).toFixed(2)} MB)`);
        this.broadcastChannel.postMessage({ type: 'quota_warning', percentage });
      }
      
      return { usage, available, percentage };
    }
    return { usage: 0, available: 0, percentage: 0 };
  }

  private async checkMemoryPressure(): Promise<void> {
    const quota = await this.checkQuota();
    if (quota.percentage > 0.9) {
      // High memory pressure - clear cache
      this.invalidateCache();
      console.warn('Memory pressure detected - cache cleared');
    }
  }

  // === STORAGE STATISTICS ===

  async getStorageStats(): Promise<StorageStats> {
    const stats: StorageStats = {
      usageBytes: 0,
      recordCounts: {
        analyses: 0,
        media_analyses: 0,
        chats: 0,
        satires: 0,
        app_state: 0,
        blob_storage: 0,
      },
      totalRecords: 0,
      encrypted: true, // All data is encrypted
      compressionRatio: 1,
      indexUsage: Object.fromEntries(this.metrics.indexUsage),
    };

    const db = await this.ensureDBOpen();
    const storeNames = Array.from(db.objectStoreNames) as StoreName[];

    let totalStoredBytes = 0;
    let totalRawBytes = 0;

    // Count records in each store
    await Promise.all(storeNames.map(async (storeName) => {
      const count = await this.executeTransaction([storeName], 'readonly', async (stores) => {
        const store = stores[0];
        return new Promise<number>((resolve, reject) => {
          const req = store.count();
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
      });
      stats.recordCounts[storeName] = count;
      stats.totalRecords += count;
    }));

    // Sample-based size estimation (first 20 records)
    await Promise.all(storeNames.map(async (storeName) => {
      await this.executeTransaction([storeName], 'readonly', async (stores) => {
        const store = stores[0];
        const request = store.openCursor();
        let samples = 0;

        await new Promise<void>((resolve) => {
          request.onsuccess = () => {
            const cursor = request.result;
            if (cursor && samples < 20) {
              const val = cursor.value;
              const json = JSON.stringify(val);
              totalStoredBytes += json.length;

              if (val.isEncrypted && val.cipher) {
                totalRawBytes += val.cipher.byteLength * 4; // Estimate 4x compression
              } else {
                totalRawBytes += json.length;
              }

              samples++;
              cursor.continue();
            } else {
              resolve();
            }
          };
        });
      });
    }));

    // Extrapolate total size
    if (stats.totalRecords > 0 && totalStoredBytes > 0) {
      stats.usageBytes = totalStoredBytes * (stats.totalRecords / Math.max(1, 20));
      stats.compressionRatio = totalRawBytes > 0 ? parseFloat((totalStoredBytes / totalRawBytes).toFixed(2)) : 1;
    }

    // Add quota information
    const quota = await this.checkQuota();
    stats.quotaUsage = quota.percentage;
    stats.quotaAvailable = quota.available;

    return stats;
  }

  // === PERFORMANCE METRICS ===

  getPerformanceMetrics(): PerformanceMetrics {
    return {
      transactionCount: this.metrics.transactionCount,
      averageTransactionTime: this.metrics.transactionCount > 0 
        ? this.metrics.totalTransactionTime / this.metrics.transactionCount 
        : 0,
      cacheHitRate: (this.metrics.cacheHits + this.metrics.cacheMisses) > 0
        ? this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)
        : 0,
      lastCleanup: this.metrics.lastCleanup,
      expiredRecords: this.metrics.expiredRecords,
    };
  }

  // === EXPORT/IMPORT ===

  async exportFullDatabase(): Promise<Blob> {
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
        schema: 'v4_optimized',
      },
    };
    return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  }

  // === REDUX PERSIST ADAPTER ===

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

  // === SUBSCRIBER PATTERN ===

  subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index >= 0) this.subscribers.splice(index, 1);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(cb => cb());
  }

  // === BLOB STORAGE ===

  async saveImageBlob(id: string, base64: string): Promise<void> {
    // Convert base64 to Blob (33% space savings)
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    await this.put('blob_storage', { id, data: blob, mimeType: mimeString, refCount: 1 });
  }

  async getImageBlob(id: string): Promise<string | null> {
    const record = await this.get<{ data: Blob; mimeType: string }>('blob_storage', id);
    if (!record) return null;

    // Convert Blob back to base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(record.data);
    });
  }

  // === CONVENIENCE METHODS ===

  async saveAnalysis(item: StoredAnalysis): Promise<void> {
    return this.put('analyses', item);
  }

  async getAnalysis(id: string): Promise<StoredAnalysis | undefined> {
    return this.get<StoredAnalysis>('analyses', id);
  }

  async saveMediaAnalysis(item: StoredMediaAnalysis): Promise<void> {
    return this.put('media_analyses', item);
  }

  async getMediaAnalysis(id: string): Promise<StoredMediaAnalysis | undefined> {
    return this.get<StoredMediaAnalysis>('media_analyses', id);
  }

  async saveChat(item: StoredChat): Promise<void> {
    return this.put('chats', item);
  }

  async saveSatire(item: StoredSatire): Promise<void> {
    return this.put('satires', item);
  }

  // === CLEAR STORE ===
  async clear(storeName: StoreName): Promise<void> {
    await this.retryTransaction(async () => {
      await this.measureTransaction(`clear_${storeName}`, async () => {
        await this.executeTransaction([storeName], 'readwrite', async (stores) => {
          const store = stores[0];
          await new Promise<void>((resolve, reject) => {
            const req = store.clear();
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
          });
        });
      });
    });
    
    this.invalidateCache(storeName);
    this.broadcastChannel.postMessage({ storeName, op: 'clear' });
  }

  // === BATCH DELETE ===
  async deleteBatch(storeName: StoreName, ids: string[]): Promise<void> {
    await this.retryTransaction(async () => {
      await this.measureTransaction(`deleteBatch_${storeName}`, async () => {
        await this.executeTransaction([storeName], 'readwrite', async (stores) => {
          const store = stores[0];
          
          for (const id of ids) {
            await new Promise<void>((resolve, reject) => {
              const req = store.delete(id);
              req.onsuccess = () => resolve();
              req.onerror = () => reject(req.error);
            });
          }
        });
      });
    });
    
    // Invalidate cache for all deleted IDs
    ids.forEach(id => this.invalidateCache(storeName, id));
    
    this.broadcastChannel.postMessage({ storeName, op: 'deleteBatch', count: ids.length });
  }
}

// === SINGLETON EXPORT ===
export const dbService = new DatabaseService();
