import { addDays, differenceInDays, endOfDay, startOfDay } from 'date-fns'

import { R } from '~/lib/utils'

interface TimeTableItem {
  label: string
  from: Date
  to: Date
}

interface TimeTableItemRender extends TimeTableItem {
  /** position the across the main axis (time) */
  beginTime: number
  endTime: number
  beginCross: number
  endCross: number
}

interface DayModel {
  items: readonly TimeTableItemRender[]
  minTime: number
  maxTime: number
  minCross: number
  maxCross: number
}

interface DayModelOpts {
  step?: `${number}min`
  beginDt: Date
  endDt: Date
}

function getCoreModel(
  data: readonly TimeTableItem[],
  {
    step = '1min',
    beginDt,
    endDt,
  }: DayModelOpts,
): DayModel {
  const items: TimeTableItemRender [] = []

  const stepMinutes = Number.parseInt(
    step.match(/(\d+)min/)?.[1] ?? '1',
    10,
  )
  const stepMS = stepMinutes * 60 * 1000

  function time2Pos(time: Date) {
    return R.pipe(
      time.getTime(),
      x => x - beginDt.getTime(),
      x => x / stepMS,
      x => Math.floor(x),
    )
  }

  let lengthCross = 0
  const occupance: Record<number, number[]> = {}

  function allocateOccupance(startPos: number, endPos: number) {
    /** already occupied crossIdxes */
    let availCross: number[] = []

    R.range(startPos, endPos).forEach((i) => {
      const occupiedCross = occupance[i] ?? []
      availCross = R.difference(availCross, occupiedCross)
    })

    if (availCross.length === 0) {
      lengthCross += 1
      availCross.push(lengthCross - 1)
    }

    const newCross = availCross[0]

    R.range(startPos, endPos).forEach((i) => {
      const tmp = occupance[i] ?? []
      occupance[i] = [...tmp, newCross]
    })

    return newCross
  }

  for (const it of data) {
    const beginTime = time2Pos(it.from)
    const endTime = time2Pos(it.to)

    const cross = allocateOccupance(beginTime, endTime)

    items.push({
      ...it,
      beginTime,
      endTime,
      beginCross: cross,
      endCross: cross + 1,
    })
  }

  return {
    items,
    minTime: time2Pos(beginDt),
    maxTime: time2Pos(endDt),
    minCross: 0,
    maxCross: lengthCross,
  }
}

interface GetScaledModelOpts extends DayModelOpts {
  orientation: 'horizontal' | 'vertical'
  timeSize: number
  crossSize: number
}

function getScaledModel(
  data: TimeTableItem[],
  {
    orientation,
    timeSize,
    crossSize,
    ...opts
  }: GetScaledModelOpts,
) {
  const { items, minTime, maxTime, minCross, maxCross } = getCoreModel(data, opts)

  const scaled = items.map(it => ({
    ...it,
    style: {
      left: it.beginTime * timeSize,
      top: it.beginCross * crossSize,
      width: (it.endTime - it.beginTime) * timeSize,
      height: (it.endCross - it.beginCross) * crossSize,
    },
  }))

  return {
    items: orientation === 'horizontal'
      ? scaled
      : scaled.map(it => ({
          ...it,
          style: {
            left: it.style.top,
            top: it.style.left,
            width: it.style.height,
            height: it.style.width,
          },
        })),
  }
}

interface createTimeTableOpts {
  data: TimeTableItem[]
}

export function createTimeTable({
  data: dataProp,
}: createTimeTableOpts) {
  const data = R.sortBy(dataProp, x => x.from.getTime())

  function _getCoreModel(opts: DayModelOpts) {
    return getCoreModel(data, opts)
  }

  function _getScaledModel(opts: GetScaledModelOpts) {
    return getScaledModel(data, opts)
  }

  function getDayModel(day: Date): DayModel {
    const startDt = startOfDay(day)
    const endDt = endOfDay(day)

    const filteredData = data.filter(x => x.to >= startDt && x.from <= endDt)

    return getCoreModel(filteredData, {
      beginDt: startDt,
      endDt,
    })
  }

  return {
    getCoreModel: _getCoreModel,
    getScaledModel: _getScaledModel,
    getDayModel,
  }
}
