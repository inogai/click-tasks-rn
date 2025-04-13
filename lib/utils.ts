import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { addDays } from 'date-fns'
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

export function dateRange(
  start: Date,
  end: Date,
  step: (x: Date) => Date = x => addDays(x, 1),
) {
  const result: Date[] = []

  for (let dt = start; dt <= end; dt = step(dt)) {
    result.push(dt)
  }

  return result
}

export * as R from 'remeda'
