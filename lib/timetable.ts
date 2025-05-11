import { R, TimeDelta } from '~/lib/utils'

/**
 * Manages the cross axis allocation (i.e. overlapped item) for a timetable.
 * It keeps track of the length of the cross axis and the occupied positions.
 */
export class CrossAxisBuilder {
  /** The size of cross axis */
  length = 0
  /**
   * The occupied positions in the cross axis
   * @field key - the position in the time axis
   * @field value - an array of occupied positions in the cross axis
   */
  occupance: Record<number, number[]> = {}

  bumpAxis() {
    this.length += 1
  }

  /**
   * allocate a position in the cross axis
   * @param startPos the start position in the time axis
   * @param lengthPos the length of the item in the time axis
   * @returns the cross axis position for the item
   */
  allocate(startPos: number, lengthPos: number) {
    const endPos = startPos + lengthPos

    let availCross: number[] = R.range(0, this.length)

    R.range(startPos, endPos).forEach((i) => {
      const occupiedCross = this.occupance[i] ?? []
      availCross = R.difference(availCross, occupiedCross)
    })

    if (availCross.length === 0) {
      this.bumpAxis()
      availCross.push(this.length - 1)
    }

    const newCross = availCross[0]

    R.range(startPos, endPos).forEach((i) => {
      const tmp = this.occupance[i] ?? []
      this.occupance[i] = [...tmp, newCross]
    })

    return newCross
  }
}

interface TimeTableItem<T> {
  item: T
  from: Date
  to: Date
}

interface CreateTimeTableOpts<T> {
  data: readonly TimeTableItem<T>[]
  orientation: 'horizontal' | 'vertical'
  timeStep?: TimeDelta
  beginDt: Date
  endDt: Date
}

export function createTimeTable<T>({
  data: dataProp,
  orientation,
  timeStep = TimeDelta.MINUTES(1),
  beginDt,
}: CreateTimeTableOpts<T>) {
  const data = R.sortBy(dataProp, x => x.from.getTime())

  function date2Pos(dt: Date) {
    return R.pipe(
      dt.getTime(),
      x => x - beginDt.getTime(),
      x => x / timeStep,
      x => Math.floor(x),
    )
  }

  const crossAxis = new CrossAxisBuilder()

  function getModel() {
    const items = data.map((it) => {
      const timeBegin = date2Pos(it.from)
      const timeEnd = date2Pos(it.to)
      const timeLength = timeEnd - timeBegin

      const crossBegin = crossAxis.allocate(timeBegin, timeLength)
      const crossEnd = crossBegin + 1
      const crossLength = (crossEnd - crossBegin)

      return {
        key: `${timeBegin}-${crossBegin}`,
        value: it.item,
        _private: {
          timeBegin,
          timeLength,
          crossBegin,
          crossLength,
        },
      }
    }).map((it) => {
      let { timeBegin, timeLength, crossBegin, crossLength } = it._private
      crossBegin = crossBegin / crossAxis.length
      crossLength = crossLength / crossAxis.length

      return Object.assign({}, it, {
        style: orientation === 'horizontal'
          ? { left: timeBegin, top: crossBegin, width: timeLength, height: crossLength }
          : { left: crossBegin, top: timeBegin, width: crossLength, height: timeLength },
      })
    })

    return { items }
  }

  return {
    getModel,
  }
}
