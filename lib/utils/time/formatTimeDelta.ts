import { t } from '~/lib/i18n'

export interface TimeDeltaBreakdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export function timeDeltaBreakdown(delta: number): TimeDeltaBreakdown {
  const milliseconds = delta % 1000
  const seconds = Math.floor(delta / 1000)
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
