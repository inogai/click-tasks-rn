import { useMemo } from 'react'

export function useArrayFrom<T>(x: ArrayLike<T>): T[] {
  return useMemo(() => Array.from(x), [x])
}
