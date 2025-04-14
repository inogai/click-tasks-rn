import { R } from '~/lib/utils'

export function useResponsive<T>(data: Record<number, T>, value: number) {
  const metrics = Object.keys(data)
    .map(x => Number.parseInt(x, 10))
    .sort()
    .reverse()

  const closestKey = R.firstBy(metrics, it => it <= value)

  return data[closestKey ?? metrics[0]] as T
}
