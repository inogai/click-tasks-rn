import { addMilliseconds } from 'date-fns'

import { dateRange } from './dateRange'
import { TimeDelta } from './TimeDelta'

describe('dateRange', () => {
  it('should return an empty array when start and end are the same', () => {
    const start = new Date('2025-05-01T12:00:00Z')
    const end = new Date('2025-05-01T12:00:00Z')
    const result = dateRange(start, end)

    expect(result).toEqual([])
  })

  it('should return an empty array when start and end are the same for negative step', () => {
    const start = new Date('2025-05-01T12:00:00Z')
    const end = new Date('2025-05-01T12:00:00Z')
    const result = dateRange(start, end, TimeDelta.DAY(-1))

    expect(result).toEqual([])
  })

  it('should not include the end date', () => {
    const start = new Date('2025-05-01T12:00:00Z')
    const end = new Date('2025-05-02T12:00:00Z')
    const step = TimeDelta.DAY(1)
    const result = dateRange(start, end, step)

    expect(result).toEqual([new Date('2025-05-01T12:00:00Z')])
  })

  it('should return `[start]` when start and end are at least 1 ms far', () => {
    const start = new Date('2025-05-01T12:00:00Z')
    const step = TimeDelta.DAY(1)
    const end = addMilliseconds(start, 1)
    const result = dateRange(start, end, step)

    expect(result).toEqual([
      new Date('2025-05-01T12:00:00Z'),
    ])
  })

  it('should return with length 2 when start and end are at least 1step and 1ms far', () => {
    const start = new Date('2025-05-01T12:00:00Z')
    const step = TimeDelta.DAY(1)
    const end = addMilliseconds(start, 1 + step)
    const result = dateRange(start, end, step)

    expect(result).toEqual([
      new Date('2025-05-01T12:00:00Z'),
      new Date('2025-05-02T12:00:00Z'),
    ])
  })

  it('should throw an error when step is 0', () => {
    const start = new Date('2025-05-01T12:00:00Z')
    const end = new Date('2025-05-02T12:00:00Z')
    const step = TimeDelta.MILLISECONDS(0)

    expect(() => dateRange(start, end, step)).toThrow(
      'step should be the same sign as end - start',
    )
  })

  it('should handle negative step', () => {
    const start = new Date('2025-05-02T12:00:00Z')
    const end = new Date('2025-05-01T12:00:00Z')
    const step = TimeDelta.DAY(-1)
    const result = dateRange(start, end, step)

    expect(result).toEqual([
      new Date('2025-05-02T12:00:00Z'),
    ])
  })

  it('should throw when end < start but step > 0', () => {
    const start = new Date('2025-05-02T12:00:00Z')
    const end = new Date('2025-05-01T12:00:00Z')
    const step = TimeDelta.DAY(1)

    expect(() => dateRange(start, end, step)).toThrow(
      'step should be the same sign as end - start',
    )
  })

  it('should throw when end > start but step < 0', () => {
    const start = new Date('2025-05-01T12:00:00Z')
    const end = new Date('2025-05-02T12:00:00Z')
    const step = TimeDelta.DAY(-1)

    expect(() => dateRange(start, end, step)).toThrow(
      'step should be the same sign as end - start',
    )
  })
})
