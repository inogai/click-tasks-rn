/**
 * Get the minimum item in an array by a given function.
 *
 * @param data - The array of items to search through.
 * @param by - A function that takes an item and returns a number to compare.
 *
 * @returns null if the array is empty, otherwise the item with the minimum value.
 */
export function minBy<T>(data: T[], by: (x: T) => number) {
  let minValue = Infinity
  let minItem: T | null = null

  for (const item of data) {
    const value = by(item)

    if (value < minValue) {
      minValue = value
      minItem = item
    }
  }

  return minItem
}

/**
 * Get the maximum item in an array by a given function. A reversed version of minBy.
 *
 * @see minBy
 */
export function maxBy<T>(data: T[], by: (x: T) => number) {
  return minBy(data, x => -by(x))
}
