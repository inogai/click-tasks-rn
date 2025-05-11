import { smartFormatDate, smartFormatDateRange } from './formatDateRanges'

describe('smartFormatDate', () => {
  it('should format date as YYYY-MM-DD HH:mm', () => {
    const date = new Date('2025-01-01T12:00:00')
    expect(smartFormatDate(date)).toBe('2025-01-01 12:00')
  })
})

describe('smartFormatDateRange', () => {
  it('should format date range correctly for same day', () => {
    const from = new Date('2025-01-01T12:00:00')
    const to = new Date('2025-01-01T15:30:00')
    expect(smartFormatDateRange(to, from)).toBe('2025-01-01 12:00 - 15:30')
  })

  it('should format date range correctly for different days', () => {
    const from = new Date('2025-01-01T12:00:00')
    const to = new Date('2025-01-02T15:30:00')
    expect(smartFormatDateRange(to, from)).toBe('2025-01-01 12:00 - 2025-01-02 15:30')
  })
})
