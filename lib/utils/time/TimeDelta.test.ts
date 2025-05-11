import { TimeDelta } from './TimeDelta'

describe('timeDelta', () => {
  it('should correctly calculate time deltas', () => {
    expect(TimeDelta.DAYS(1)).toBe(24 * 60 * 60 * 1000)
    expect(TimeDelta.HOURS(1)).toBe(60 * 60 * 1000)
    expect(TimeDelta.MINUTES(1)).toBe(60 * 1000)
    expect(TimeDelta.SECONDS(1)).toBe(1000)
    expect(TimeDelta.MILLISECONDS(1)).toBe(1)
  })
})
