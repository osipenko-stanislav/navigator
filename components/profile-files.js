// Files stay in this browser; profile metadata remains in localStorage.
let databasePromise

function openDatabase() {
  if (!databasePromise) databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open('cpk:v2:profile-files', 1)
    request.onupgradeneeded = () => request.result.createObjectStore('files')
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => { databasePromise = undefined; reject(request.error) }
  })
  return databasePromise
}

export async function readProfileFile(key) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const request = database.transaction('files').objectStore('files').get(key)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export async function writeProfileFiles(entries, removedKeys = []) {
  if (!entries.length && !removedKeys.length) return
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('files', 'readwrite')
    const store = transaction.objectStore('files')
    removedKeys.forEach((key) => store.delete(key))
    entries.forEach(([key, file]) => store.put(file, key))
    transaction.oncomplete = resolve
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}
