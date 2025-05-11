import {
  formatTimeDelta,
  formatTimeDeltaLeft,
  timeDeltaBreakdown,
} from './formatTimeDelta'
import { TimeDelta } from './TimeDelta'

// We only test the formatting of the time delta, not the i18n part
describe('timeDeltaBreakdown', () => {
  it('should return the correct breakdown for a positive time delta', () => {
    const delta = TimeDelta.DAYS(1)
      + TimeDelta.HOURS(3)
      + TimeDelta.MINUTES(5)
      + TimeDelta.SECONDS(7)
      + TimeDelta.MILLISECONDS(11)
    const expected = {
      days: 1,
      hours: 3,
      minutes: 5,
      seconds: 7,
      milliseconds: 11,
      count: delta,
    }
    expect(timeDeltaBreakdown(delta)).toEqual(expected)
  })

  it('should throw for negative timeDelta', () => {
    const delta = -1
    expect(() => timeDeltaBreakdown(delta)).toThrow(RangeError)
  })

  it('should return the correct breakdown for a zero time delta', () => {
    const delta = 0
    const expected = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      count: 0,
    }
    expect(timeDeltaBreakdown(delta)).toEqual(expected)
  })
})

describe('formatTimeDelta', () => {
  it('should format the time delta correctly', () => {
    const delta = TimeDelta.DAYS(1)
      + TimeDelta.HOURS(3)
      + TimeDelta.MINUTES(5)
      + TimeDelta.SECONDS(7)
      + TimeDelta.MILLISECONDS(11)
    const expected = '1 day 3 hours 5 minutes 7 seconds'
    expect(formatTimeDelta(delta)).toEqual(expected)
    expect(formatTimeDeltaLeft(delta)).toEqual(`${expected} left`)
  })

  it('should format a zero time delta correctly', () => {
    const delta = 0
    const expected = 'No time'
    expect(formatTimeDelta(delta)).toEqual(expected)
    expect(formatTimeDeltaLeft(delta)).toEqual(`${expected} left`)
  })
})
