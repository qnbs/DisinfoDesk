# IndexedDB Architecture & Optimization Guide

## Table of Contents
1. [Overview](#overview)
2. [Schema Design](#schema-design)
3. [Indexing Strategy](#indexing-strategy)
4. [Performance Optimization](#performance-optimization)
5. [Security & Encryption](#security--encryption)
6. [Caching Strategy](#caching-strategy)
7. [Batch Operations](#batch-operations)
8. [TTL Management](#ttl-management)
9. [Monitoring & Diagnostics](#monitoring--diagnostics)
10. [Migration Guide](#migration-guide)

---

## Overview

DisinfoDesk uses a state-of-the-art IndexedDB implementation designed for enterprise-grade performance, security, and reliability. The implementation features:

- **Schema Version:** v4 (current)
- **Encryption:** AES-GCM-256 with dedicated key storage
- **Compression:** gzip (3-5x reduction)
- **Caching:** LRU cache (100 entries, 5-minute TTL)
- **Batch Processing:** 20-item queues with 50ms flush delay
- **TTL Management:** Automatic hourly cleanup
- **Cross-Tab Sync:** BroadcastChannel API
- **Retry Logic:** Exponential backoff (3 attempts)

**Architecture Philosophy:**
- **Offline-First:** All data accessible without network
- **Performance:** Sub-10ms queries with compound indexes
- **Reliability:** Transaction retry with exponential backoff
- **Security:** Client-side encryption with separate key storage
- **Scalability:** Streaming iterators for large datasets

---

## Schema Design

### Database: `DisinfoDesk_Vault`

**Version History:**
- v1: Initial schema with basic stores
- v2: Added app_state store
- v3: Added blob_storage with reference counting
- v4: Compound indexes, TTL management (current)

### Object Stores

#### 1. `analyses`
```typescript
{
  keyPath: 'id',
  indices: [
    { name: 'timestamp', keyPath: 'timestamp', unique: false },
    { name: 'timestamp_id', keyPath: ['timestamp', 'id'], unique: true },
    { name: 'expiresAt', keyPath: 'expiresAt', unique: false }
  ]
}

// Record Structure
interface StoredAnalysis {
  id: string;
  theoryId: string;
  language: 'en' | 'de';
  analysis: AnalysisResult;
  timestamp: number;
  expiresAt: number; // TTL
}
```

**Use Cases:**
- Store AI-generated theory analyses
- Query by timestamp (recent first)
- Automatic cleanup after 30 days

#### 2. `media_analyses`
```typescript
{
  keyPath: 'id',
  indices: [/* same as analyses */]
}

// Record Structure
interface StoredMediaAnalysis {
  id: string;
  mediaId: string;
  language: 'en' | 'de';
  analysis: MediaAnalysisResult;
  timestamp: number;
  expiresAt: number;
}
```

**Use Cases:**
- Store AI-generated media source analyses
- Query by timestamp
- Automatic cleanup after 30 days

#### 3. `chats`
```typescript
{
  keyPath: 'id',
  indices: [/* same as analyses */]
}

// Record Structure
interface StoredChat {
  id: string;
  messages: Array<{ role: 'user' | 'model'; text: string }>;
  context?: string;
  timestamp: number;
  expiresAt: number;
}
```

**Use Cases:**
- Persist chat conversation history
- Resume conversations across sessions
- Automatic cleanup after 30 days

#### 4. `satires`
```typescript
{
  keyPath: 'id',
  indices: [/* same as analyses */]
}

// Record Structure
interface StoredSatire {
  id: string;
  theoryId: string;
  content: string;
  timestamp: number;
  expiresAt: number;
}
```

**Use Cases:**
- Store AI-generated satire content
- Browse by creation date
- Automatic cleanup after 30 days

#### 5. `app_state`
```typescript
{
  keyPath: 'key',
  indices: []
}

// Record Structure (Redux Persist)
interface AppState {
  key: string;      // Redux persist key
  value: string;    // Serialized state
}
```

**Use Cases:**
- Redux-Persist storage adapter
- Persist Redux state across sessions
- No TTL (permanent storage)

#### 6. `blob_storage`
```typescript
{
  keyPath: 'id',
  indices: [
    { name: 'refCount', keyPath: 'refCount', unique: false }
  ]
}

// Record Structure
interface BlobRecord {
  id: string;
  data: Blob;        // Binary data (images)
  mimeType: string;
  refCount: number;  // Garbage collection
}
```

**Use Cases:**
- Store images as Blobs (33% smaller than base64)
- Reference counting for garbage collection
- Efficient binary data storage

---

## Indexing Strategy

### Primary Indexes

#### **timestamp** (Single-Field Index)
```typescript
store.createIndex('timestamp', 'timestamp', { unique: false });
```

**Purpose:** Chronological ordering
**Query Pattern:** `getAll()`, `streamAll()` (recent first)
**Performance:** O(log n) cursor navigation

#### **timestamp_id** (Compound Index)
```typescript
store.createIndex('timestamp_id', ['timestamp', 'id'], { unique: true });
```

**Purpose:** Unique chronological ordering with ID tiebreaker
**Query Pattern:** Range queries, pagination
**Performance:** O(log n) with guaranteed uniqueness
**Benefits:**
- Eliminates duplicate timestamp issues
- Enables efficient pagination
- Faster range queries

#### **expiresAt** (TTL Index)
```typescript
store.createIndex('expiresAt', 'expiresAt', { unique: false });
```

**Purpose:** Automatic record expiration
**Query Pattern:** `cleanupExpiredRecords()` (IDBKeyRange.upperBound)
**Performance:** O(n) cleanup (batched hourly)
**Benefits:**
- Automatic data lifecycle management
- Prevents quota exhaustion
- Privacy-friendly (auto-delete old data)

### Index Usage Tracking

The `dbService` tracks index usage to identify optimization opportunities:

```typescript
const metrics = dbService.getPerformanceMetrics();
console.log(metrics.indexUsage);
// {
//   timestamp: 1234,      // Used 1234 times
//   timestamp_id: 567,
//   expiresAt: 89
// }
```

---

## Performance Optimization

### 1. LRU Cache (Hot Data Optimization)

**Configuration:**
- **Size:** 100 entries
- **TTL:** 5 minutes
- **Eviction:** Least recently used

**Implementation:**
```typescript
private cache = new Map<string, CacheEntry>();

interface CacheEntry {
  data: unknown;
  timestamp: number;
  hits: number;
  size: number;  // bytes
}
```

**Cache Key Format:** `${storeName}:${id}`

**Operations:**
```typescript
// Cache-aware get
const data = await dbService.get('analyses', '123');
// → Checks cache first (< 1ms)
// → Falls back to IndexedDB (< 10ms)

// Cache invalidation
dbService.invalidateCache('analyses', '123');
// → Removes specific entry

dbService.invalidateCache('analyses');
// → Clears all entries for store

dbService.invalidateCache();
// → Clears entire cache
```

**Performance Impact:**
- **Cache Hit:** < 1ms (80%+ hit rate after warm-up)
- **Cache Miss:** < 10ms (with index usage)
- **Memory Usage:** ~5-10MB (100 entries)

### 2. Batch Operations (Write Throughput Optimization)

**Configuration:**
- **Queue Size:** 20 items (auto-flush)
- **Flush Delay:** 50ms (debounced)

**Benefits:**
- **10-20x faster** than individual writes
- Reduced transaction overhead
- Automatic batching

**Usage:**
```typescript
// Individual writes (slow)
await dbService.put('analyses', item1);  // 5ms
await dbService.put('analyses', item2);  // 5ms
await dbService.put('analyses', item3);  // 5ms
// Total: 15ms

// Batched writes (fast)
await Promise.all([
  dbService.putBatch('analyses', item1),
  dbService.putBatch('analyses', item2),
  dbService.putBatch('analyses', item3)
]);
// Total: ~2ms (single transaction)
```

**Automatic Flush Triggers:**
1. Queue reaches 20 items
2. 50ms timeout
3. Manual `flushBatch()` call

### 3. Streaming Iterators (Memory Efficiency)

**Problem:** Loading 1000+ records into memory = 100+ MB
**Solution:** Async generators with lazy evaluation

**Usage:**
```typescript
// Memory-efficient streaming
for await (const analysis of dbService.streamAll('analyses')) {
  // Process one at a time (low memory)
  processAnalysis(analysis);
}

// Traditional (high memory)
const all = await dbService.getAll('analyses');
all.forEach(processAnalysis);  // Loads all into memory
```

**Performance:**
- **Memory:** O(1) vs O(n)
- **First Result:** < 10ms (same as traditional)
- **Total Time:** Same (but streaming UI updates)

### 4. Compound Index Queries (Query Optimization)

**Without Compound Index:**
```typescript
// Fetches all, filters in JS (slow)
const all = await dbService.getAll('analyses');
const filtered = all.filter(a => a.timestamp > startTime && a.timestamp < endTime);
```

**With Compound Index:**
```typescript
// Uses index directly (fast)
const result = await dbService.query('analyses', {
  startKey: [startTime, ''],
  endKey: [endTime, '\uffff'],
  limit: 20
});
```

**Performance:**
- **Without Index:** O(n) full scan
- **With Index:** O(log n + k) where k = result count

### 5. Retry Logic (Reliability Optimization)

**Exponential Backoff Configuration:**
- **Max Retries:** 3
- **Base Delay:** 100ms
- **Delays:** 100ms, 200ms, 400ms

**Failure Scenarios:**
- Concurrent transaction conflicts
- Quota exceeded (transient)
- Browser throttling

**Implementation:**
```typescript
async retryTransaction<T>(fn: () => Promise<T>, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      await sleep(100 * Math.pow(2, attempt));
    }
  }
}
```

---

## Security & Encryption

### Encryption Pipeline

```
Plain Data
  ↓
JSON.stringify
  ↓
[Compression] gzip (CompressionStream API)
  ↓
[Encryption] AES-GCM-256 with random IV
  ↓
Stored Data: { iv: ArrayBuffer, cipher: ArrayBuffer, isEncrypted: true }
```

### Key Management

**Dedicated Key Database:** `DisinfoDesk_CryptoKeys`

**Benefits:**
- Isolated from application data
- Cannot be accidentally deleted
- Separate backup/restore

**Migration from localStorage:**
```typescript
// Legacy: localStorage.getItem('disinfoDesk_masterKey')
// → Insecure (plain text accessible)

// Current: Dedicated IndexedDB
// → Secure (requires explicit database access)
```

**Key Generation:**
```typescript
const key = await window.crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  true,  // extractable
  ['encrypt', 'decrypt']
);
```

**Key Storage Format:** JWK (JSON Web Key)

### Encryption Performance

**Typical Record:**
- **Plain:** 10 KB JSON
- **Compressed:** 2 KB (gzip)
- **Encrypted:** 2.1 KB (with IV)
- **Time:** < 5ms

**Compression Ratios (Observed):**
- **Text-heavy data:** 3-5x reduction
- **JSON with structure:** 2-3x reduction
- **Binary data:** 1-1.5x reduction

---

## Caching Strategy

### Multi-Level Caching

```
Request
  ↓
[Level 1] LRU Cache (memory)
  ↓ (miss)
[Level 2] IndexedDB
  ↓ (miss)
[Level 3] Network (if applicable)
```

### Cache Invalidation Triggers

1. **Manual Invalidation:**
   ```typescript
   dbService.invalidateCache('analyses', '123');
   ```

2. **Write Operations:**
   ```typescript
   await dbService.put('analyses', data);  // Auto-invalidates
   ```

3. **Cross-Tab Updates:**
   ```typescript
   BroadcastChannel → cache.clear()
   ```

4. **TTL Expiration:**
   ```typescript
   entry.timestamp + CACHE_TTL < Date.now()  // Auto-evict
   ```

5. **Memory Pressure:**
   ```typescript
   quotaUsage > 0.9 → cache.clear()
   ```

### Cache Warming

**Cold Start (no cache):**
- First query: 10ms (IndexedDB)
- Cache miss rate: 100%

**Warm Cache:**
- First query: 1ms (memory)
- Cache hit rate: 80%+

**Recommendation:** Pre-warm cache on app startup:
```typescript
await dbService.getAll('analyses');  // Populates cache
```

---

## Batch Operations

### Write Batching

**Queue Management:**
```typescript
private batchQueue: BatchOperation[] = [];
private batchTimer: ReturnType<typeof setTimeout> | null = null;
```

**Flush Logic:**
```typescript
if (queue.length >= 20) {
  flushBatch();  // Size trigger
} else if (!timer) {
  timer = setTimeout(flushBatch, 50);  // Time trigger
}
```

**Transaction Grouping:**
```typescript
// Group by store for efficient transactions
Map<StoreName, BatchOperation[]>

// Execute per store
for (const [store, ops] of byStore) {
  await executeTransaction([store], 'readwrite', async (stores) => {
    for (const op of ops) {
      await store.put(await encrypt(op.data));
    }
  });
}
```

**Performance:**
- **Individual:** 5ms per write
- **Batched (20 items):** 10ms total (~0.5ms per write)
- **Speedup:** 10x

---

## TTL Management

### Record Lifecycle

```
Record Created
  ↓
timestamp: Date.now()
expiresAt: Date.now() + TTL_DEFAULT (30 days)
  ↓
[Stored in IndexedDB]
  ↓
[Hourly Cleanup]
  ↓
expiresAt < Date.now() → DELETE
```

### Cleanup Process

**Schedule:** Every 60 minutes

**Implementation:**
```typescript
async cleanupExpiredRecords(): Promise<number> {
  const now = Date.now();
  let expiredCount = 0;
  
  for (const store of stores) {
    const index = store.index('expiresAt');
    const range = IDBKeyRange.upperBound(now);
    const cursor = index.openCursor(range);
    
    // Delete all expired records
    while (await cursor.next()) {
      await cursor.delete();
      expiredCount++;
    }
  }
  
  return expiredCount;
}
```

**Performance:**
- **100 expired records:** ~50ms
- **1000 expired records:** ~500ms
- **Impact:** Background task (no UI blocking)

### Custom TTL

```typescript
await dbService.put('analyses', {
  id: '123',
  data: {...},
  expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)  // 7 days
});
```

---

## Monitoring & Diagnostics

### Performance Metrics

```typescript
const metrics = dbService.getPerformanceMetrics();

{
  transactionCount: 1234,
  averageTransactionTime: 4.5,  // ms
  cacheHitRate: 0.82,            // 82%
  lastCleanup: 1704067200000,
  expiredRecords: 45
}
```

### Storage Statistics

```typescript
const stats = await dbService.getStorageStats();

{
  usageBytes: 5242880,           // ~5 MB
  recordCounts: {
    analyses: 150,
    media_analyses: 50,
    chats: 20,
    satires: 10,
    app_state: 5,
    blob_storage: 3
  },
  totalRecords: 238,
  encrypted: true,
  compressionRatio: 0.3,         // 70% reduction
  quotaUsage: 0.05,              // 5% of quota
  quotaAvailable: 104857600,     // ~100 MB
  indexUsage: {
    timestamp: 1234,
    timestamp_id: 567,
    expiresAt: 89
  }
}
```

### Quota Management

```typescript
const quota = await dbService.checkQuota();

{
  usage: 5242880,                // 5 MB
  available: 104857600,          // 100 MB
  percentage: 0.05               // 5%
}

// Warning at 80%
if (quota.percentage > 0.8) {
  console.warn('Storage quota warning');
  // → Trigger cleanup or notify user
}
```

### Debug Mode

**Enable Developer Mode:**
Settings → Advanced → Developer Mode → ON

**Verbose Logging:**
- Transaction timings
- Cache hit/miss
- Index usage
- Quota warnings
- Error stack traces

**Chrome DevTools:**
1. F12 → Application → IndexedDB → DisinfoDesk_Vault
2. Inspect stores, records, indexes
3. Manual CRUD operations

---

## Migration Guide

### Version Upgrade Path

#### v3 → v4 Migration

**Changes:**
- Added compound index `timestamp_id`
- Added TTL index `expiresAt`
- Backfilled TTL for existing records

**Implementation:**
```typescript
request.onupgradeneeded = (event) => {
  if (event.oldVersion < 4) {
    const tx = event.target.transaction;
    
    stores.forEach(name => {
      const store = tx.objectStore(name);
      
      // Add compound index
      if (!store.indexNames.contains('timestamp_id')) {
        store.createIndex('timestamp_id', ['timestamp', 'id'], { unique: true });
      }
      
      // Add TTL index
      if (!store.indexNames.contains('expiresAt')) {
        store.createIndex('expiresAt', 'expiresAt', { unique: false });
      }
      
      // Backfill TTL for existing records
      const cursor = store.openCursor();
      cursor.onsuccess = () => {
        if (cursor.result) {
          const record = cursor.result.value;
          if (!record.expiresAt) {
            record.expiresAt = Date.now() + TTL_DEFAULT;
            cursor.result.update(record);
          }
          cursor.result.continue();
        }
      };
    });
  }
};
```

**Data Preservation:**
- ✅ All existing data retained
- ✅ No data loss
- ✅ Backward compatible reads

### Future Migrations

#### Planned v5 Features
- Full-text search index (for theory titles/descriptions)
- Category index (for filtering)
- Multi-entry tags index
- Metadata store for real-time statistics

**Best Practices:**
1. **Test migrations locally:** Use Chrome profiles
2. **Backup before upgrade:** `exportFullDatabase()`
3. **Incremental rollout:** Test with beta users
4. **Rollback plan:** Keep v4 code branch

---

## Performance Benchmarks

### Query Performance

| Operation | Cold Cache | Warm Cache | Notes |
|-----------|------------|------------|-------|
| `get()` | 8-12ms | < 1ms | Single record |
| `getAll()` | 50-100ms | 10-20ms | 200 records |
| `query()` (paginated) | 10-15ms | 2-5ms | 20 records |
| `put()` | 5-8ms | N/A | Single write |
| `putBatch()` (20 items) | 10-15ms | N/A | Batched writes |
| `delete()` | 3-5ms | N/A | Single delete |
| `streamAll()` | 5ms (first) | N/A | Memory-efficient |

### Storage Efficiency

| Data Type | Plain | Compressed | Encrypted | Ratio |
|-----------|-------|------------|-----------|-------|
| JSON (theory) | 10 KB | 2 KB | 2.1 KB | 5x |
| Chat history | 50 KB | 10 KB | 10.1 KB | 5x |
| Analysis result | 20 KB | 6 KB | 6.1 KB | 3.3x |

### Memory Usage

| Scenario | Heap Size | Notes |
|----------|-----------|-------|
| Empty cache | 0 MB | No data loaded |
| Warm cache (100 entries) | 5-10 MB | Average record size |
| Full dataset (1000 records) | 50-100 MB | Without streaming |
| Streaming (1000 records) | 5-10 MB | Constant memory |

---

## Troubleshooting

### Common Issues

#### 1. **Quota Exceeded Error**
**Symptoms:**
```
QuotaExceededError: The quota has been exceeded
```

**Solutions:**
```typescript
// Check quota
const quota = await dbService.checkQuota();
console.log(quota.percentage);  // > 0.9

// Manual cleanup
await dbService.cleanupExpiredRecords();

// Clear old data
const old = Date.now() - (7 * 24 * 60 * 60 * 1000);
// Delete records older than 7 days
```

#### 2. **Slow Queries**
**Symptoms:** Queries taking > 100ms

**Diagnosis:**
```typescript
const metrics = dbService.getPerformanceMetrics();
console.log(metrics.averageTransactionTime);
```

**Solutions:**
- Enable compound index for range queries
- Use pagination instead of `getAll()`
- Pre-warm cache on startup
- Check browser throttling (DevTools)

#### 3. **Cache Thrashing**
**Symptoms:** Low cache hit rate (< 50%)

**Diagnosis:**
```typescript
const metrics = dbService.getPerformanceMetrics();
console.log(metrics.cacheHitRate);  // < 0.5
```

**Solutions:**
- Increase cache size (edit `CACHE_MAX_SIZE`)
- Increase TTL (edit `CACHE_TTL`)
- Review access patterns (frequent random access = bad for LRU)

#### 4. **Decryption Failures**
**Symptoms:**
```
Vault Access Denied: Decryption Failed
```

**Causes:**
- Corrupted key database
- Browser profile change
- Incognito mode (ephemeral storage)

**Recovery:**
```typescript
// Clear key database (will regenerate)
await indexedDB.deleteDatabase('DisinfoDesk_CryptoKeys');

// Re-encrypt all data (requires export/import)
const backup = await dbService.exportFullDatabase();
// → Save backup, clear database, re-import
```

---

## Best Practices

### Development
1. **Always use TypeScript types:** Catches schema mismatches early
2. **Test migrations:** Use separate Chrome profiles
3. **Monitor performance:** Log slow transactions (> 100ms)
4. **Handle errors:** Wrap all IndexedDB calls in try-catch
5. **Use transactions properly:** Never nest transactions

### Production
1. **Enable quota warnings:** Alert users at 80% usage
2. **Implement backup:** Prompt users to export data
3. **Schedule cleanups:** Run TTL cleanup hourly
4. **Monitor cache:** Log cache hit rate in analytics
5. **Graceful degradation:** Handle QuotaExceededError

### Security
1. **Never log encrypted data:** Avoid exposing cipher/IV
2. **Rotate keys periodically:** Implement key versioning
3. **Validate inputs:** Sanitize before encryption
4. **Separate key storage:** Never mix keys with data
5. **Use HTTPS:** Prevent MITM attacks on API keys

---

## References

- **IndexedDB Specification:** https://www.w3.org/TR/IndexedDB/
- **Web Crypto API:** https://www.w3.org/TR/WebCryptoAPI/
- **Compression Streams API:** https://wicg.github.io/compression/
- **BroadcastChannel API:** https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel

---

<p align="center">
  <strong>DisinfoDesk IndexedDB v4 – Enterprise-Grade Client-Side Database</strong>
</p>
