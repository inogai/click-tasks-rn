import type { ViewRef } from '@rn-primitives/types'
import type { TaskRecord } from '~/lib/realm'

import { addHours, differenceInMinutes, endOfDay, endOfHour, formatDate, startOfDay, startOfHour } from 'date-fns'
import { useNavigation } from 'expo-router'
import { useMemo, useRef } from 'react'

import { Pressable } from '~/components/ui/pressable'
import { Text, View } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { createTimeTable, scaleBy } from '~/lib/timetable'
import { useMeasure } from '~/lib/use-mesaure'
import { cn, dateRange, maxBy, minBy, R, TimeDelta } from '~/lib/utils'

interface TimelineViewProps {
  tasks: TaskRecord[]
  className?: string
  date: Date
}

const GRID_WIDTH = 16

export function TimelineView({
  tasks,
  className,
  date,
}: TimelineViewProps) {
  const hasPlanned = R.filter(tasks, x =>
    R.isNonNullish(x.plannedBegin) && R.isNonNullish(x.plannedEnd))
  const data = hasPlanned
    .map(x => ({
      item: x,
      from: x.plannedBegin!,
      to: x.plannedEnd!,
    }))

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

  const timeTable = useMemo(() => createTimeTable({
    data,
    beginDt,
    endDt,
    orientation: 'horizontal',
  }), [beginDt, data, endDt])

  const containerRef = useRef<ViewRef>(null)
  const { width: containerWidth, height: containerHeight } = useMeasure(containerRef, {
    width: 0,
  })

  const diff = differenceInMinutes(endDt, beginDt)
  const widthPerMinute = containerWidth / diff

  const grid_span_hours = widthPerMinute * 60 < 24
    ? 2
    : 1

  const navigation = useNavigation()

  return (
    <View className={cn('h-24 w-full px-4', className)}>
      {hasPlanned.length === 0
        ? <Text>{t('timeline_view.placeholder')}</Text>
        : (
            <View ref={containerRef} className="relative flex-1">
              {dateRange(
                beginDt,
                addHours(endDt, 1),
                TimeDelta.HOUR(grid_span_hours),
              ).map((dt, index) => {
                const label = formatDate(dt, 'HH')
                return (
                  <View
                    key={label}
                    className="absolute top-0 items-center"
                    textClass="text-sm font-semibold text-muted-foreground"
                    style={{
                      left: index * 60 * grid_span_hours * widthPerMinute - GRID_WIDTH / 2,
                      width: GRID_WIDTH,
                      height: 80,
                    }}
                  >
                    <Text>{label}</Text>
                    <View className="mt-1 h-full w-px bg-muted-foreground" />
                  </View>
                )
              })}

              {timeTable.getModel().items.map((item) => {
                return (
                  <View
                    key={item.key}
                    className="absolute overflow-hidden rounded-md bg-primary"
                    textClass="text-xs font-semibold text-primary-foreground"
                    style={scaleBy(item.style, {
                      x: x => x * widthPerMinute,
                      y: x => 24 + x * 24,
                      my: 1,
                    })}
                  >
                    <Pressable
                      className="h-full p-1"
                      onPress={() => {
                        navigation.navigate('task/update', {
                          taskId: item.value._id.toString(),
                        })
                      }}
                    >
                      <Text>{item.value.summary}</Text>
                    </Pressable>
                  </View>
                )
              })}
            </View>
          )}
    </View>
  )
}
