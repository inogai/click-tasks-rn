import { useEffect, useRef } from 'react'

/**
 * Lags behind the current value by 1 update.
 *
 * @param value The current value
 * @returns The previous value, or undefined if there is no previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    return () => {
      ref.current = value
    }
  }, [value])

  return ref.current
}
