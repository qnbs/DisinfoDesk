const KEY_DB = 'DisinfoDesk_KeyVault';
const KEY_DB_VERSION = 1;
const KEY_STORE = 'secure_secrets';
const API_KEY_RECORD = 'gemini_api_key';
const WRAP_KEY_RECORD = 'gemini_wrap_key_jwk';

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
  return key;
};

export const secureApiKeyService = {
  validateKeyFormat(apiKey: string): { valid: boolean; error?: string } {
    const trimmed = apiKey.trim();
    if (!trimmed) return { valid: false, error: 'EMPTY_API_KEY' };
    if (trimmed.length < 30) return { valid: false, error: 'KEY_TOO_SHORT' };
    if (!/^AIza[A-Za-z0-9_-]{30,}$/.test(trimmed)) return { valid: false, error: 'INVALID_KEY_FORMAT' };
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
};
