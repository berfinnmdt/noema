/**
 * Tarayıcı yerel depolaması için güvenli okuma/yazma katmanı.
 * - Tüm anahtarlar "noema." ön ekiyle ad alır.
 * - Bozuk JSON, erişim hatası veya kota aşımı durumlarında çökmez.
 */

const NAMESPACE = 'noema'

export const STORAGE_KEYS = {
  journal: 'journal.v1',
  likes: 'likes.v1',
} as const

export function readStorage<T>(key: string, fallback: T, isValid?: (value: unknown) => value is T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(`${NAMESPACE}.${key}`)
    if (raw === null) return fallback

    const parsed: unknown = JSON.parse(raw)
    if (isValid && !isValid(parsed)) return fallback

    return parsed as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false

  try {
    window.localStorage.setItem(`${NAMESPACE}.${key}`, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStorage(key: string): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(`${NAMESPACE}.${key}`)
  } catch {
    /* sessizce yoksay */
  }
}

export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const probe = `${NAMESPACE}.__probe`
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}
