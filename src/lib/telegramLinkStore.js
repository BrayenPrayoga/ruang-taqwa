const STORE_KEY = '__telegram_link_store__';

const getStore = () => {
  if (!globalThis[STORE_KEY]) {
    globalThis[STORE_KEY] = new Map();
  }
  return globalThis[STORE_KEY];
};

export const saveTelegramLink = (code, payload) => {
  const store = getStore();
  store.set(code, { ...payload, updatedAt: Date.now() });
};

export const getTelegramLink = (code) => {
  const store = getStore();
  return store.get(code) || null;
};
