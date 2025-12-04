import { StoredAnalysis, StoredChat, StoredSatire, VaultBackup, StoredMediaAnalysis } from '../types';

const DB_NAME = 'DisinfoDesk_Vault';
const DB_VERSION = 2; // Upgraded for Media Analyses

interface DBSchema {
  analyses: StoredAnalysis;
  media_analyses: StoredMediaAnalysis;
  chats: StoredChat;
  satires: StoredSatire;
  app_state: { key: string; value: string }; // Store for Redux Persist state
}

type StoreName = keyof DBSchema;

export interface StorageStats {
  usageBytes: number;
  recordCounts: Record<StoreName, number>;
  totalRecords: number;
}

class DatabaseService {
  private db: IDBDatabase | null = null;
  private pendingOpen: Promise<IDBDatabase> | null = null;

  /**
   * Opens a secure connection to the IndexedDB.
   * Implements a singleton pattern.
   */
  private async open(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.pendingOpen) return this.pendingOpen;

    this.pendingOpen = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Helper to safely create stores
        const createStore = (name: string, keyPath: string = 'id') => {
           if (!db.objectStoreNames.contains(name)) {
             const store = db.createObjectStore(name, { keyPath });
             // Add timestamp index for chronological sorting (except for key-value store)
             if (name !== 'app_state') {
               store.createIndex('timestamp', 'timestamp', { unique: false });
             }
           }
        };

        createStore('analyses');
        createStore('media_analyses'); // New store
        createStore('chats');
        createStore('satires');
        createStore('app_state', 'key'); // Redux Persist Key-Value Store
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        
        this.db.onclose = () => {
            console.warn('[Vault] Connection closed unexpectedly. Resetting handle.');
            this.db = null;
            this.pendingOpen = null;
        };

        this.db.onversionchange = () => {
            console.warn('[Vault] Version change detected. Closing connection.');
            this.db?.close();
            this.db = null;
            this.pendingOpen = null;
        };

        resolve(this.db);
      };

      request.onerror = (event) => {
        this.db = null;
        this.pendingOpen = null;
        console.error('[Vault] Connection failed', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.pendingOpen;
  }

  // --- CRUD Operations ---

  async getAll<T>(storeName: StoreName): Promise<T[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      
      const request = (storeName !== 'app_state' && store.indexNames.contains('timestamp'))
        ? store.index('timestamp').getAll() 
        : store.getAll();

      request.onsuccess = () => {
          const result = request.result as T[];
          // Reverse time sort if using timestamp index (newest first)
          resolve((storeName !== 'app_state' && store.indexNames.contains('timestamp')) ? result.reverse() : result);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: StoreName, key: string): Promise<T | undefined> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put<T>(storeName: StoreName, value: T): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(value);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: StoreName, key: string): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async clear(storeName: StoreName): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        store.clear();
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
  }

  async deleteBatch(storeName: StoreName, keys: string[]): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      keys.forEach(key => {
        store.delete(key);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error('Batch delete transaction failed'));
    });
  }

  // --- Redux Persist Storage Engine Interface ---
  public reduxStorage = {
    getItem: async (key: string): Promise<string | null> => {
      try {
        const record = await this.get<{ key: string; value: string }>('app_state', key);
        return record ? record.value : null;
      } catch (e) {
        console.error('Redux Storage Get Error:', e);
        return null;
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        await this.put('app_state', { key, value });
      } catch (e) {
        console.error('Redux Storage Set Error:', e);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        await this.delete('app_state', key);
      } catch (e) {
        console.error('Redux Storage Remove Error:', e);
      }
    },
  };

  // --- Statistics & Backup ---

  async getStorageStats(): Promise<StorageStats> {
    const stores: StoreName[] = ['analyses', 'media_analyses', 'chats', 'satires', 'app_state'];
    const stats: StorageStats = {
      usageBytes: 0,
      recordCounts: { analyses: 0, media_analyses: 0, chats: 0, satires: 0, app_state: 0 },
      totalRecords: 0
    };

    const db = await this.open();
    const tx = db.transaction(stores, 'readonly');

    const promises = stores.map(storeName => {
        return new Promise<void>((resolve, reject) => {
            const store = tx.objectStore(storeName);
            const countReq = store.count();
            countReq.onsuccess = () => {
                stats.recordCounts[storeName] = countReq.result;
                stats.totalRecords += countReq.result;
            };

            // Estimate size
            const cursorReq = store.openCursor();
            cursorReq.onsuccess = (e) => {
                // Use generic IDBRequest<IDBCursorWithValue> to avoid 'any'
                const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
                if (cursor) {
                    const value = cursor.value;
                    const size = JSON.stringify(value).length * 2; // Approx bytes
                    stats.usageBytes += size;
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            cursorReq.onerror = () => reject(cursorReq.error);
        });
    });

    await Promise.all(promises);
    return stats;
  }

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
          schema: 'v3_enhanced'
      }
    };
    return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  }

  async importDatabase(jsonString: string): Promise<{success: boolean, message: string}> {
    try {
      const data = JSON.parse(jsonString) as VaultBackup;
      
      if (!data.meta || !data.meta.app || data.meta.app !== 'DisinfoDesk_Vault') {
          return { success: false, message: "Security Violation: Invalid vault signature." };
      }

      let count = 0;

      if (Array.isArray(data.analyses)) {
        for (const item of data.analyses) { await this.saveAnalysis(item); count++; }
      }
      if (Array.isArray(data.media_analyses)) {
        for (const item of data.media_analyses) { await this.saveMediaAnalysis(item); count++; }
      }
      if (Array.isArray(data.chats)) {
        for (const item of data.chats) { await this.saveChat(item); count++; }
      }
      if (Array.isArray(data.satires)) {
        for (const item of data.satires) { await this.saveSatire(item); count++; }
      }
      if (Array.isArray(data.settings)) {
        for (const item of data.settings) { await this.put('app_state', item); count++; }
      }
      
      return { success: true, message: `Vault restored. ${count} records integrated.` };
    } catch (e) {
      console.error("Import failed:", e);
      return { success: false, message: "Corrupt data stream." };
    }
  }

  // --- Wrappers ---

  async saveAnalysis(analysis: StoredAnalysis) {
    return this.put('analyses', analysis);
  }

  async getAnalysis(id: string) {
    return this.get<StoredAnalysis>('analyses', id);
  }

  async saveMediaAnalysis(analysis: StoredMediaAnalysis) {
    return this.put('media_analyses', analysis);
  }

  async getMediaAnalysis(id: string) {
    return this.get<StoredMediaAnalysis>('media_analyses', id);
  }

  async saveChat(chat: StoredChat) {
    return this.put('chats', chat);
  }

  async saveSatire(satire: StoredSatire) {
    return this.put('satires', satire);
  }
}

export const dbService = new DatabaseService();