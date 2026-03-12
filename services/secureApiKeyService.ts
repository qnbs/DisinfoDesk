const KEY_DB = 'DisinfoDesk_KeyVault';
const KEY_DB_VERSION = 1;
const KEY_STORE = 'secure_secrets';
const API_KEY_RECORD = 'gemini_api_key';
const WRAP_KEY_RECORD = 'gemini_wrap_key_jwk';
const INTEGRITY_RECORD = 'keyvault_integrity_hash';

// Multi-provider key record IDs
const PROVIDER_KEY_RECORDS: Record<string, string> = {
  gemini: 'gemini_api_key',
  xai: 'xai_api_key',
  anthropic: 'anthropic_api_key',
};

interface SecretRecord {
  id: string;
  value: string;
}

const openKeyDb = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(KEY_DB, KEY_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(KEY_STORE)) {
        db.createObjectStore(KEY_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const setSecret = async (id: string, value: string): Promise<void> => {
  const db = await openKeyDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(KEY_STORE, 'readwrite');
    tx.objectStore(KEY_STORE).put({ id, value } as SecretRecord);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const getSecret = async (id: string): Promise<string | null> => {
  const db = await openKeyDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(KEY_STORE, 'readonly');
    const req = tx.objectStore(KEY_STORE).get(id);
    req.onsuccess = () => resolve((req.result as SecretRecord | undefined)?.value ?? null);
    req.onerror = () => reject(req.error);
  });
};

const deleteSecret = async (id: string): Promise<void> => {
  const db = await openKeyDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(KEY_STORE, 'readwrite');
    tx.objectStore(KEY_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const getOrCreateWrappingKey = async (): Promise<CryptoKey> => {
  const existingJwk = await getSecret(WRAP_KEY_RECORD);

  if (existingJwk) {
    return crypto.subtle.importKey(
      'jwk',
      JSON.parse(existingJwk),
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const exported = await crypto.subtle.exportKey('jwk', key);
  await setSecret(WRAP_KEY_RECORD, JSON.stringify(exported));

  // Store integrity hash to detect tampering
  const hash = await computeIntegrityHash(JSON.stringify(exported));
  await setSecret(INTEGRITY_RECORD, hash);

  return key;
};

/** Compute SHA-256 integrity hash for tamper detection */
async function computeIntegrityHash(data: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Verify wrapping key integrity — returns false if tampered */
async function verifyKeyIntegrity(): Promise<boolean> {
  const storedJwk = await getSecret(WRAP_KEY_RECORD);
  const storedHash = await getSecret(INTEGRITY_RECORD);
  if (!storedJwk || !storedHash) return true; // No key yet = OK
  const currentHash = await computeIntegrityHash(storedJwk);
  return currentHash === storedHash;
}

export const secureApiKeyService = {
  validateKeyFormat(apiKey: string, provider: string = 'gemini'): { valid: boolean; error?: string } {
    const trimmed = apiKey.trim();
    if (!trimmed) return { valid: false, error: 'EMPTY_API_KEY' };
    if (trimmed.length < 10) return { valid: false, error: 'KEY_TOO_SHORT' };

    if (provider === 'gemini') {
      if (trimmed.length < 30) return { valid: false, error: 'KEY_TOO_SHORT' };
      if (!/^AIza[A-Za-z0-9_-]{30,}$/.test(trimmed)) return { valid: false, error: 'INVALID_KEY_FORMAT' };
    } else if (provider === 'xai') {
      if (!/^xai-[A-Za-z0-9_-]{20,}$/.test(trimmed)) return { valid: false, error: 'INVALID_KEY_FORMAT' };
    } else if (provider === 'anthropic') {
      if (!/^sk-ant-[A-Za-z0-9_-]{20,}$/.test(trimmed)) return { valid: false, error: 'INVALID_KEY_FORMAT' };
    }
    return { valid: true };
  },

  async testApiKey(apiKey: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey.trim())}`,
        { method: 'GET', signal: AbortSignal.timeout(10000) }
      );
      if (resp.ok) return { ok: true };
      if (resp.status === 400 || resp.status === 403) return { ok: false, error: 'INVALID_KEY' };
      return { ok: false, error: `HTTP_${resp.status}` };
    } catch {
      return { ok: false, error: 'NETWORK_ERROR' };
    }
  },

  async setApiKey(apiKey: string): Promise<void> {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      throw new Error('EMPTY_API_KEY');
    }

    const wrappingKey = await getOrCreateWrappingKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      wrappingKey,
      encoder.encode(trimmed)
    );

    const payload = JSON.stringify({
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted)),
    });

    await setSecret(API_KEY_RECORD, payload);
  },

  async getApiKey(): Promise<string | null> {
    const payload = await getSecret(API_KEY_RECORD);
    if (!payload) return null;

    // Integrity check — detect wrapping key tampering
    const integrityOk = await verifyKeyIntegrity();
    if (!integrityOk) {
      console.error('[KeyVault] Integrity check failed — wrapping key may have been tampered with');
      return null;
    }

    try {
      const parsed = JSON.parse(payload) as { iv: number[]; data: number[] };
      const wrappingKey = await getOrCreateWrappingKey();

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(parsed.iv) },
        wrappingKey,
        new Uint8Array(parsed.data)
      );

      return decoder.decode(decrypted);
    } catch {
      return null;
    }
  },

  async hasApiKey(): Promise<boolean> {
    const key = await this.getApiKey();
    return Boolean(key && key.length > 0);
  },

  async clearApiKey(): Promise<void> {
    await deleteSecret(API_KEY_RECORD);
  },

  // --- Multi-provider key management ---

  async setProviderKey(provider: string, apiKey: string): Promise<void> {
    const recordId = PROVIDER_KEY_RECORDS[provider];
    if (!recordId) throw new Error(`Unknown provider: ${provider}`);
    const trimmed = apiKey.trim();
    if (!trimmed) throw new Error('EMPTY_API_KEY');

    const wrappingKey = await getOrCreateWrappingKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      wrappingKey,
      encoder.encode(trimmed)
    );
    const payload = JSON.stringify({
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted)),
    });
    await setSecret(recordId, payload);
  },

  async getProviderKey(provider: string): Promise<string | null> {
    const recordId = PROVIDER_KEY_RECORDS[provider];
    if (!recordId) return null;
    const payload = await getSecret(recordId);
    if (!payload) return null;

    try {
      const parsed = JSON.parse(payload) as { iv: number[]; data: number[] };
      const wrappingKey = await getOrCreateWrappingKey();
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(parsed.iv) },
        wrappingKey,
        new Uint8Array(parsed.data)
      );
      return decoder.decode(decrypted);
    } catch {
      return null;
    }
  },

  async hasProviderKey(provider: string): Promise<boolean> {
    const key = await this.getProviderKey(provider);
    return Boolean(key && key.length > 0);
  },

  async clearProviderKey(provider: string): Promise<void> {
    const recordId = PROVIDER_KEY_RECORDS[provider];
    if (recordId) await deleteSecret(recordId);
  },
};
