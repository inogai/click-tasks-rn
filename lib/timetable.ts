import { R, TimeDelta } from '~/lib/utils'

class CrossAxisBuilder {
  length = 0
  occupance: Record<number, number[]> = {}

  bumpAxis() {
    this.length += 1
  }

  allocate(startPos: number, lengthPos: number) {
    const endPos = startPos + lengthPos - 1

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

interface Style {
  left: number
  top: number
  width: number
  height: number
}

interface ScaleOpts {
  x: (value: number) => number
  y: (value: number) => number
  mx?: number
  my?: number
}

export function scaleBy(
  style: Style,
  { x, y, mx = 0, my = 0 }: ScaleOpts,
) {
  return {
    left: x(style.left) + mx,
    top: y(style.top) + my,
    width: x(style.width) - x(0) - 2 * mx,
    height: y(style.height) - y(0) - 2 * my,
  }
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
      const timeEnd = date2Pos(it.to) + 1
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
