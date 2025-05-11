import { Time } from './Time'
import { TimeDelta } from './TimeDelta'

describe('time', () => {
  describe('validate', () => {
    it('should throw an error for invalid time', () => {
      expect(() => Time.validate(new Date(-1))).toThrow(RangeError)
      expect(() => Time.validate(new Date(24 * 60 * 60 * 1000 + 1))).toThrow(RangeError)
      expect(() => Time.validate(new Date(Number.NaN))).toThrow(RangeError)
    })

    it('should return the time for valid input', () => {
      const validTime = new Date(12 * 60 * 60 * 1000)
      expect(Time.validate(validTime)).toEqual(validTime)
    })
  })

  describe('difference', () => {
    it('should return a TimeDelta between two times', () => {
      const timeA = Time.fromLiteral('12:00')
      const timeB = Time.fromLiteral('13:00')
      const delta = Time.difference(timeA, timeB)
      expect(delta).toEqual(TimeDelta.HOURS(1))
    })

    it('should handle negative differences', () => {
      const timeA = Time.fromLiteral('13:00')
      const timeB = Time.fromLiteral('12:00')
      const delta = Time.difference(timeA, timeB)
      expect(delta).toEqual(TimeDelta.HOURS(-1))
    })
  })

  describe('fromMs', () => {
    it('should convert milliseconds to Time', () => {
      const ms = 12 * 60 * 60 * 1000
      const time = Time.fromMs(ms)
      expect(time.getTime()).toEqual(ms)
    })
  })

  describe('fromMinutes', () => {
    it('should convert minutes to Time', () => {
      const minutes = 12 * 60
      const time = Time.fromMinutes(minutes)
      expect(time.getTime()).toEqual(minutes * 60 * 1000)
    })
  })

  describe('fromLiteral', () => {
    it('should convert a string literal to Time', () => {
      const time = Time.fromLiteral('12:30')
      expect(time.getTime()).toEqual(12 * 60 * 60 * 1000 + 30 * 60 * 1000)
    })

    it('should throw an error for invalid format', () => {
      // overflow
      expect(() => Time.fromLiteral('12:60')).toThrow(RangeError)
      expect(() => Time.fromLiteral('25:00')).toThrow(RangeError)
      // single digit
      expect(() => Time.fromLiteral('12:0')).toThrow(RangeError)
      expect(() => Time.fromLiteral('0:01')).toThrow(RangeError)
      // negative numbers
      expect(() => Time.fromLiteral('01:-00')).toThrow(RangeError)
      expect(() => Time.fromLiteral('-01:00')).toThrow(RangeError)
    })
  })

  describe('fromDate', () => {
    it('should convert a Date to Time', () => {
      const date = new Date('2023-10-01T12:30:00') // local time
      const time = Time.fromDate(date)
      expect(time.getTime()).toEqual(12 * 60 * 60 * 1000 + 30 * 60 * 1000)
    })

    it('should throw an error for invalid date', () => {
      const invalidDate = new Date('invalid-date')

      expect(() => Time.fromDate(invalidDate)).toThrow(RangeError)
    })
  })

  describe('fromClamp', () => {
    it('should clamp >= 24:00 to 24:00', () => {
      const date = new Date(86401 * 1000) // local time
      const time = Time.fromClamp(date)
      expect(time).toEqual(Time.fromLiteral('24:00'))
    })

    it('should clamp <= 00:00 to 00:00', () => {
      const date = new Date(-1 * 1000) // local time
      const time = Time.fromClamp(date)
      expect(time).toEqual(Time.fromLiteral('00:00'))
    })
  })

  describe('format', () => {
    it('should format Time to HH:MM', () => {
      const time = Time.fromLiteral('12:30')
      expect(Time.format(time)).toEqual('12:30')
    })

    it('should pad single digits with leading zeros', () => {
      const time = Time.fromLiteral('01:05')
      expect(Time.format(time)).toEqual('01:05')
    })

    it('should handle edge cases correctly', () => {
      const time = Time.fromLiteral('24:00')
      expect(Time.format(time)).toEqual('24:00')

      const time2 = Time.fromLiteral('00:00')
      expect(Time.format(time2)).toEqual('00:00')
    })

    it('should throw an error for invalid Time', () => {
      const invalidTime = new Date('invalid-time') as unknown as Time
      expect(() => Time.format(invalidTime)).toThrow(RangeError)

      const invalidTime2 = new Date('2023-10-01T12:30:00') as unknown as Time
      expect(() => Time.format(invalidTime2)).toThrow(RangeError)
    })
  })

  describe('getHours', () => {
    it('should return the hours from Time', () => {
      const time = Time.fromLiteral('12:30')
      expect(Time.getHours(time)).toEqual(12)
    })

    it('should throw an error for invalid Time', () => {
      const invalidTime = new Date('invalid-time') as unknown as Time
      expect(() => Time.getHours(invalidTime)).toThrow(RangeError)
    })
  })

  describe('getMinutes', () => {
    it('should return the minutes from Time', () => {
      const time = Time.fromLiteral('12:30')
      expect(Time.getMinutes(time)).toEqual(30)
    })

    it('should throw an error for invalid Time', () => {
      const invalidTime = new Date('invalid-time') as unknown as Time
      expect(() => Time.getMinutes(invalidTime)).toThrow(RangeError)
    })
  })
})
