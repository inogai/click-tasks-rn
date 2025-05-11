import { clampDate } from './clampDate'

describe('clampDate', () => {
  it('should return a copy of the date if the date is within range', () => {
    const date = new Date('2025-05-01T12:00:00Z')
    const min = new Date('2025-05-01T00:00:00Z')
    const max = new Date('2025-05-01T23:59:59Z')
    const result = clampDate(date, min, max)

    expect(result).toEqual(date)
    expect(result).not.toBe(date)
  })

  it('should return a copy of min if it is less than the minimum', () => {
    const date = new Date('2025-04-29T12:00:00Z')
    const min = new Date('2025-05-01T00:00:00Z')
    const max = new Date('2025-05-01T23:59:59Z')
    const result = clampDate(date, min, max)

    expect(result).toEqual(min)
    expect(result).not.toBe(min)
  })

  it('should return a copy of max if it is greater than the maximum', () => {
    const date = new Date('2025-05-02T12:00:00Z')
    const min = new Date('2025-05-01T00:00:00Z')
    const max = new Date('2025-05-01T23:59:59Z')
    const result = clampDate(date, min, max)

    expect(result).toEqual(max)
    expect(result).not.toBe(max)
  })

  it('should throw an error if min is greater than max', () => {
    const date = new Date('2025-05-01T12:00:00Z')
    const min = new Date('2025-05-01T23:59:59Z')
    const max = new Date('2025-05-01T00:00:00Z')

    expect(() => clampDate(date, min, max)).toThrow(new RangeError('min must be less than max'))
  })

  it('should handle when some dates are the same', () => {
    const date = new Date('2025-05-01T12:00:00Z')
    const min = new Date('2025-05-01T12:00:00Z')
    const max = new Date('2025-05-01T12:00:00Z')

    const mmM = clampDate(min, min, max)
    expect(mmM).toEqual(min)
    expect(mmM).not.toBe(min)

    const MmM = clampDate(max, min, max)
    expect(MmM).toEqual(max)
    expect(MmM).not.toBe(max)

    const dmm = clampDate(date, min, min)
    expect(dmm).toEqual(min)
    expect(dmm).not.toBe(min)

    const ddd = clampDate(date, date, date)
    expect(ddd).toEqual(date)
    expect(ddd).not.toBe(date)
  })

  it('should throw if date is invalid', () => {
    const invalidDate = new Date('invalid-date')
    expect(invalidDate.getTime()).toBeNaN()

    expect(() => clampDate(invalidDate, new Date(), new Date()))
      .toThrow(new TypeError('Invalid date'))
  })
})
