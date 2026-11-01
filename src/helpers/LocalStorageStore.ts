// Shared localStorage read/write helpers for Pinia store persistence.
export function saveToLocalStorage(key: string, data: Object) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function loadFromLocalStorage(key: string): any {
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : null
}

export function removeFromLocalStorage(key: string) {
  localStorage.removeItem(key)
}
