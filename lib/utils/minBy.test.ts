import { minBy } from './minBy'

describe('minBy', () => {
  it('should return the item with the minimum value', () => {
    const data = [1, 2, 3, 4, 5]
    const result = minBy(data, x => x)

    expect(result).toBe(1)
  })

  it('should return null for an empty array', () => {
    const data: number[] = []
    const result = minBy(data, x => x)

    expect(result).toBeNull()
  })

  it('should return the first item if value is same', () => {
    const data = [{ a: 1, b: 'first' }, { a: 1, b: 'second' }, { a: 1, b: 'last' }]
    const result = minBy(data, x => x.a)

    expect(result).toEqual(data[0])
  })
})
