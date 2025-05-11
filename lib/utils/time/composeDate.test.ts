import { composeDate } from './composeDate'
import { Time } from './Time'

describe('composeDate', () => {
  it('should create a date with the time part of another date', () => {
    const date = new Date('2025-05-01T12:00:00') // notice this is a local date
    const time = Time.fromLiteral('14:30')
    const result = composeDate(date, time)

    expect(result).toEqual(new Date('2025-05-01T14:30:00')) // notice this is a local date
  })

  it('should create a date with the time part of another date in local timezone', () => {
    const date = new Date('2025-05-01T12:00:00Z') // notice this is a UTC date
    const time = Time.fromLiteral('14:30')
    const result = composeDate(date, time)

    expect(result).toEqual(new Date('2025-05-01T14:30:00')) // notice this is a local date
  })
})
