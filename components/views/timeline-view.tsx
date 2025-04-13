import type { ViewRef } from '@rn-primitives/types'
import type { TaskRecord } from '~/lib/realm'

import { useRealm } from '@realm/react'
import { addHours, differenceInMinutes, endOfDay, endOfHour, formatDate, startOfDay, startOfHour } from 'date-fns'
import { useMemo, useRef } from 'react'

import { Text, View } from '~/components/ui/text'

import { createTimeTable } from '~/lib/timetable'
import { useMeasure } from '~/lib/use-mesaure'
import { cn, dateRange, maxBy, minBy, R } from '~/lib/utils'

interface TimelineViewProps {
  tasks: TaskRecord[]
  className?: string
  date: Date
}

const GRID_WIDTH = 16
const GRID_SPAN_HOURS = 1

export function TimelineView({
  tasks,
  className,
  date,
}: TimelineViewProps) {
  const timeTable = useMemo(() => createTimeTable({
    data: tasks
      .filter(x => x.plannedBegin && x.plannedEnd)
      .map(x => ({
        label: x.summary,
        from: x.plannedBegin!,
        to: x.plannedEnd!,
      })),
  }), [tasks])

  const containerRef = useRef<ViewRef>(null)
  const { width: containerWidth, height: containerHeight } = useMeasure(containerRef, {
    width: 300,
  })

  const hasPlanned = R.filter(tasks, x =>
    R.isNonNullish(x.plannedBegin) && R.isNonNullish(x.plannedEnd))

  const beginDt = R.pipe(
    hasPlanned,
    R.map(it => it.plannedBegin!),
    it => minBy(it, x => x.getTime()),
    it => it ?? startOfDay(date),
    it => maxBy([it, startOfDay(date)], x => x.getTime())!,
    it => startOfHour(it),
  )

  const endDt = R.pipe(
    hasPlanned,
    R.map(it => it.plannedEnd!),
    it => maxBy(it, x => x.getTime()),
    it => (it ?? endOfDay(date)),
    it => minBy([it, endOfDay(date)], x => x.getTime())!,
    it => endOfHour(it),
  )

  const diff = differenceInMinutes(endDt, beginDt)
  const widthPerMinute = containerWidth / diff

  return (
    <View className={cn('h-36 w-full px-4', className)}>
      <View ref={containerRef} className="relative">
        {dateRange(
          beginDt,
          addHours(endDt, 1),
          x => addHours(x, GRID_SPAN_HOURS),
        ).map((dt, index) => {
          const label = formatDate(dt, 'HH')
          return (
            <View
              key={label}
              className="absolute top-0 items-center"
              textClass="text-sm font-semibold text-muted-foreground"
              style={{
                left: index * 60 * GRID_SPAN_HOURS * widthPerMinute - GRID_WIDTH / 2,
                width: GRID_WIDTH,
                height: 80,
              }}
            >
              <Text>{label}</Text>
              <View className="mt-1 h-full w-px bg-muted-foreground" />
            </View>
          )
        })}

        {timeTable.getDayModel(date).items.length
          ? timeTable.getScaledModel({
              beginDt,
              endDt,
              orientation: 'horizontal',
              timeSize: widthPerMinute,
              crossSize: 24,
            }).items.map((item) => {
              return (
                <View
                  key={`${item.beginTime}_${item.beginCross}`}
                  className="absolute rounded-md bg-primary px-2 py-1"
                  textClass="text-xs font-semibold text-primary-foreground"
                  style={{
                    ...item.style,
                    top: item.style.top + 24,
                  }}
                >
                  <Text>{item.label}</Text>
                </View>
              )
            })
          : <Text>No tasks today.</Text>}
      </View>
    </View>
  )
}
