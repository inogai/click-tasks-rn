import { TimeDelta } from '~/lib/utils'

import {
  createTimeTable,
  CrossAxisBuilder,
} from './timetable'

declare global {
  // eslint-disable-next-line ts/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeDistinct: () => R
    }
  }
}

expect.extend({
  toBeDistinct(received) {
    const uniqueValues = new Set(received)
    const pass = uniqueValues.size === received.length
    return {
      pass,
      message: () => pass
        ? ''
        : `Expected values to be distinct, but found duplicates in: ${JSON.stringify(received)}`,
    }
  },
})

describe('crossAxisBuilder', () => {
  const builder = new CrossAxisBuilder()
  it('should create a cross axis', () => {
    const result = builder.allocate(0, 1)

    expect(result).toEqual(0)
    expect(builder.length).toEqual(1)
    expect(builder.occupance).toEqual({
      0: [0],
    })
  })

  it('should bump the cross axis', () => {
    const result2 = builder.allocate(0, 2)
    expect(result2).toEqual(1)
    expect(builder.length).toEqual(2)
    expect(builder.occupance).toEqual({
      0: [0, 1],
      1: [1],
    })
  })

  it('should put the item in cross 0 even if there are already bumped', () => {
    const result3 = builder.allocate(1, 1)
    expect(result3).toEqual(0)
    expect(builder.length).toEqual(2)
    expect(builder.occupance).toEqual({
      0: [0, 1],
      1: [1, 0],
    })
  })
})

describe('createTimeTable', () => {
  it('should create a timetable', () => {
    const data = [
      { item: 'A', from: new Date('2023-01-01T00:00:00Z'), to: new Date('2023-01-01T00:10:00Z') },
      { item: 'B', from: new Date('2023-01-01T00:05:00Z'), to: new Date('2023-01-01T00:15:00Z') },
    ]

    const result = createTimeTable({
      data,
      orientation: 'horizontal',
      timeStep: TimeDelta.MINUTES(1),
      beginDt: new Date('2023-01-01T00:00:00Z'),
      endDt: new Date('2023-01-01T00:20:00Z'),
    }).getModel().items

    expect(result.length).toEqual(2)
    expect(result[0].value).toEqual('A')
    expect(result.map(x => x.key)).toBeDistinct()
    expect(result[0].style).toEqual({
      left: 0,
      width: 10, // since it is 10 minutes long
      top: 0,
      height: 0.5, // since it overlaps with B
    })
    expect(result[1].style).toEqual({
      left: 5, // since it starts at 5 minutes
      width: 10,
      top: 0.5, // since it overlaps with A
      height: 0.5,
    })
  })
})
