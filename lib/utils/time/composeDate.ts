import { Time } from './Time'

/**
 * Create a date object by replacing the time part of the date with the time part of another date.
 *
 * @param date - The date part of the new date.
 * @param time - The time part of the new date.
 */
export function composeDate(date: Date, time: Time): Date {
  const dateTime = new Date(date)
  dateTime.setHours(Time.getHours(time))
  dateTime.setMinutes(Time.getMinutes(time))
  dateTime.setSeconds(0)
  dateTime.setMilliseconds(0)
  return dateTime
}
