import { clampDate } from './clampDate'
import { TimeDelta } from './TimeDelta'

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
