import { batched } from './batched'

describe('batched', () => {
  it('should split an array into batches of the specified size', () => {
    const input = [1, 2, 3, 4, 5, 6, 7]
    const batchSize = 3
    const result = batched(input, batchSize)

    expect(result).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7],
    ])
  })

  it('should handle an empty array', () => {
    const input: number[] = []
    const batchSize = 3
    const result = batched(input, batchSize)

    expect(result).toEqual([])
  })

  it('should handle a batch size larger than the array length', () => {
    const input = [1, 2, 3]
    const batchSize = 5
    const result = batched(input, batchSize)

    expect(result).toEqual([
      [1, 2, 3],
    ])
  })

  it('should handle a batch size of 1', () => {
    const input = [1, 2, 3]
    const batchSize = 1
    const result = batched(input, batchSize)

    expect(result).toEqual([
      [1],
      [2],
      [3],
    ])
  })

  it('should throw an error if batch size is less than 1', () => {
    const input = [1, 2, 3]
    const batchSize = 0

    expect(() => batched(input, batchSize)).toThrow('Batch size must be greater than 0')
  })
})
