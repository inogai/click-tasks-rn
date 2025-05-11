/**
 * Clamps a date to be within a specified range.
 *
 * @param date - The date to clamp.
 * @param min - The minimum date.
 * @param max - The maximum date.
 */
export function clampDate(date: Date, min: Date, max: Date): Date {
  if (Number.isNaN(date.getTime() + min.getTime() + max.getTime())) {
    throw new TypeError('Invalid date')
  }

  if (min > max) {
    throw new RangeError('min must be less than max')
  }

  if (date < min) {
    return new Date(min)
  }
  if (date > max) {
    return new Date(max)
  }
  return new Date(date)
}
