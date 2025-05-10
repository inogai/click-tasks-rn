import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { addMilliseconds } from 'date-fns'
import * as R from 'remeda'
import { twMerge } from 'tailwind-merge'

import { t } from '~/lib/i18n'

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
  DAY: (n: number) => n * 24 * 60 * 60 * 1000 as TimeDelta,
  HOUR: (n: number) => n * 60 * 60 * 1000 as TimeDelta,
  MINUTE: (n: number) => n * 60 * 1000 as TimeDelta,
  SECONDS: (n: number) => n * 1000 as TimeDelta,
  MILLISECONDS: (n: number) => n as TimeDelta,
} as const

export type Time = Date & { __tag: 'Time' }

// eslint-disable-next-line ts/no-redeclare
export const Time = {
  validate(time: Date): Time {
    const ms = time.getTime()
    if (ms < 0 || ms > 24 * 60 * 60 * 1000) {
      throw new RangeError('Time must be between 00:00 and 24:00 hours')
    }
    return time as Time
  },
  difference(a: Time, b: Time): TimeDelta {
    return TimeDelta.MILLISECONDS(b.getTime() - a.getTime())
  },
  fromMs(ms: number): Time {
    return Time.validate(new Date(ms))
  },
  fromMinutes(minutes: number): Time {
    return Time.fromMs(minutes * 60 * 1000)
  },
  fromLiteral(str: `${number}:${number}`): Time {
    const [hours, minutes] = str.split(':').map(it => Number.parseInt(it, 10))
    return Time.fromMinutes(hours * 60 + minutes)
  },
  fromDate(date: Date): Time {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return Time.fromMinutes(hours * 60 + minutes)
  },
  fromClamp(date: Date): Time {
    return Time.validate(clampDate(date, Time.fromLiteral('00:00'), Time.fromLiteral('24:00')))
  },
  format(time: Time): string {
    const hours = Time.getHours(time)
    const minutes = Time.getMinutes(time)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  },
  getHours(time: Time): number {
    return Math.floor(time.getTime() / (60 * 60 * 1000))
  },
  getMinutes(time: Time): number {
    return Math.floor((time.getTime() % (60 * 60 * 1000)) / (60 * 1000))
  },
}

export function composeDate(date: Date, time: Time): Date {
  const dateTime = new Date(date)
  dateTime.setHours(Time.getHours(time))
  dateTime.setMinutes(Time.getMinutes(time))
  dateTime.setSeconds(0)
  dateTime.setMilliseconds(0)
  return dateTime
}

export function clampDate(date: Date, min: Date, max: Date): Date {
  if (date < min) {
    return new Date(min)
  }
  if (date > max) {
    return new Date(max)
  }
  return date
}

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

export function batched<T>(list: T[], batchSize: number) {
  const batches = []
  for (let i = 0; i < list.length; i += batchSize) {
    batches.push(list.slice(i, i + batchSize))
  }
  return batches
}

export interface TimeDeltaBreakdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export function timeDeltaBreakdown(
  delta: number,
): TimeDeltaBreakdown {
  const milliseconds = delta % 1000
  const seconds = Math.floor((delta / 1000))
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  return {
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    milliseconds: milliseconds % 1000,
  }
}

export function formatTimeDelta(timeDelta: number) {
  return t(
    'timedelta.val',
    timeDeltaBreakdown(timeDelta),
  )
    .trim()
    .replaceAll(/\s+/g, ' ')
}

export function formatTimeDeltaLeft(timeDelta: number) {
  return t(
    'timedelta.val_left',
    timeDeltaBreakdown(timeDelta),
  )
    .trim()
    .replaceAll(/\s+/g, ' ')
}

export * as R from 'remeda'
