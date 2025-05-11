import { formatDate, startOfDay } from 'date-fns'

const DATE_FORMAT = 'yyyy-MM-dd'
const TIME_FORMAT = 'HH:mm'
const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`

function smartFormatDay(day: Date) {
  // TODO: maybe we can add a preference to use relative date
  return formatDate(day, DATE_FORMAT)
}

function smartFormatTime(time: Date) {
  return formatDate(time, TIME_FORMAT)
}

export function smartFormatDate(date: Date) {
  return formatDate(date, DATE_TIME_FORMAT)
}

export function smartFormatDateRange(
  to: Date,
  from: Date,
) {
  const toDay = startOfDay(to)
  const fromDay = startOfDay(from)

  // is of the same day
  if (toDay.getTime() === fromDay.getTime()) {
    const dateString = smartFormatDay(toDay)
    const toString = smartFormatTime(to)
    const fromString = smartFormatTime(from)

    return `${dateString} ${fromString} - ${toString}`
  }

  // is not of the same day
  const toString = smartFormatDate(to)
  const fromString = smartFormatDate(from)

  return `${fromString} - ${toString}`
}
