/**
 * Split list into batches of a given size
 */
export function batched<T>(list: T[], batchSize: number) {
  if (batchSize < 1) {
    throw new Error('Batch size must be greater than 0')
  }

  const batches = []
  for (let i = 0; i < list.length; i += batchSize) {
    batches.push(list.slice(i, i + batchSize))
  }
  return batches
}
