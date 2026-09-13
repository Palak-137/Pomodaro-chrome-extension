export const storageService = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing to localStorage key "${key}":`, e);
    }
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      try {
        chrome.storage.local.set({ [key]: value });
      } catch (e) {
        console.warn(`Error writing to chrome.storage.local key "${key}":`, e);
      }
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e);
    }
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      try {
        chrome.storage.local.remove(key);
      } catch (e) {
        console.warn(`Error removing chrome.storage.local key "${key}":`, e);
      }
    }
  },
};
