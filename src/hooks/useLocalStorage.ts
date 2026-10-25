import { useCallback, useRef, useState } from 'react'
import { readStorage, writeStorage } from '../lib/storage'

/**
 * Tarayıcı yerel depolamasıyla eşlenen state.
 * Bozuk veri veya kota hatası durumunda uygulama çökmez.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid?: (value: unknown) => value is T,
): readonly [T, (next: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(() => readStorage(key, initialValue, isValid))
  const [persisted, setPersisted] = useState(true)
  const valueRef = useRef(value)

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(valueRef.current) : next

      valueRef.current = resolved
      setValue(resolved)
      setPersisted(writeStorage(key, resolved))
    },
    [key],
  )

  return [value, update, persisted] as const
}
