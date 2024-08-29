export function storage(key, value) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('assets', 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore('storage', { keyPath: 'key' });
    };

    request.onsuccess = () => {
      const transaction = request.result.transaction('storage', 'readwrite');
      const store = transaction.objectStore('storage');

      if (value === undefined) {
        const request = store.get(key);
        request.onsuccess = () =>
          resolve(request.result && request.result.value);
      } else {
        store.put({ key, value });
        transaction.oncomplete = () => resolve();
      }
    };

    request.onblocked = reject;
    request.onerror = reject;
  });
}
