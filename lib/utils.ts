import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { addMilliseconds } from 'date-fns'
import * as R from 'remeda'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function minBy<T>(data: T[], by: (x: T) => number) {
  let minValue = Infinity
  let minItem: T | null = null

  for (const item of data) {
    const value = by(item)

    if (value < minValue) {
      minValue = value
      minItem = item
    }
  }

  return minItem
}

export function maxBy<T>(data: T[], by: (x: T) => number) {
  return minBy(data, x => -by(x))
}

/** Tagged type for milliseconds */
export type TimeDelta = number & { __tag: 'TimeDelta' }

// eslint-disable-next-line ts/no-redeclare
export const TimeDelta = {
  HOUR: (n: number) => n * 60 * 60 * 1000 as TimeDelta,
  MINUTE: (n: number) => n * 60 * 1000 as TimeDelta,
  SECONDS: (n: number) => n * 1000 as TimeDelta,
  MILLISECONDS: (n: number) => n as TimeDelta,
} as const

export function dateRange(
  start: Date,
  end: Date,
  step: TimeDelta = TimeDelta.MINUTE(1),
) {
  const diffMS = end.getTime() - start.getTime()
  const numSteps = Math.ceil(diffMS / step)

  return R.range(0, numSteps).map(i =>
    addMilliseconds(start, i * step),
  )
}

export * as R from 'remeda'
