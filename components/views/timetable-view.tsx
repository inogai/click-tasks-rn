import { addDays, addHours, addMilliseconds, addMinutes, differenceInDays, isSameDay } from 'date-fns'
import { router } from 'expo-router'
import * as React from 'react'

import { Pressable } from '~/components/ui/pressable'
import { Text, View } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { TaskRecord, useRealmQuery } from '~/lib/realm'
import { createTimeTable } from '~/lib/timetable'
import { useMeasure } from '~/lib/use-mesaure'
import { clampDate, cn, composeDate, dateRange, minBy, R, Time, TimeDelta } from '~/lib/utils'

interface TimeTableItem {
  from: Date
  to: Date
  item: TaskRecord
}

function getTimeInterval(begin: Date, end: Date) {
  const diff = end.getTime() - begin.getTime()
  if (diff > TimeDelta.HOUR(12))
    return TimeDelta.HOUR(2)
  if (diff > TimeDelta.HOUR(6))
    return TimeDelta.HOUR(1)
  return TimeDelta.MINUTE(30)
}

interface TimeTableProps {
  className?: string
  items: TimeTableItem[]
  // x-axis - date
  dateBegin: Date
  dateEnd: Date
  // y-axis - time
  timeBegin: Time
  timeEnd: Time
}

export function TimeTable({
  items,
  className,
  dateBegin,
  dateEnd,
  timeBegin,
  timeEnd,
}: TimeTableProps) {
  const containerRef = React.useRef(null)
  const { width, height } = useMeasure(containerRef)
  const numDates = differenceInDays(dateEnd, dateBegin)

  // NOTE: add 1 timeUnit padding before and after
  const timeInteval = getTimeInterval(timeBegin, timeEnd)
  timeBegin = Time.fromClamp(addMilliseconds(timeBegin, -timeInteval))
  timeEnd = Time.fromClamp(addMilliseconds(timeEnd, +timeInteval))
  // end add padding

  const H_PER_MS = height / (timeEnd.getTime() - timeBegin.getTime())

  function getY(time: Date) {
    const delta = Time.difference(timeBegin, Time.validate(time))
    return delta * H_PER_MS + 0
  }

  const timetables = R.pipe(
    dateRange(dateBegin, dateEnd, TimeDelta.DAY(1)),
    R.map(day => [composeDate(day, timeBegin), composeDate(day, timeEnd)]),
    R.map(([beginDt, endDt]) => {
      const localItems = R.pipe(
        items,
        // NOTE: clamp dates to [beginDt, endDt]
        // prevents items from overflowing
        R.map(x => ({ ...x, from: clampDate(x.from, beginDt, endDt), to: clampDate(x.to, beginDt, endDt) })),
        // remove the items that does not overlap with the [beginDt, endDt]
        R.filter(x => x.from.getTime() < x.to.getTime()),
      )

      return createTimeTable({
        data: localItems,
        beginDt,
        endDt,
        orientation: 'vertical',
      })
    }),
  )

  return (
    <View className={cn('flex-1 flex-row', className)}>
      <View className="w-12">
        {dateRange(
          timeBegin,
          addMilliseconds(timeEnd, timeInteval),
          timeInteval,
        )
          .map(date => (
            <Text
              className="absolute text-sm font-medium text-muted-foreground"
              key={date.getTime()}
              style={{ top: getY(date) }}
            >
              {Time.format(date as Time)}
            </Text>
          ))}
      </View>
      <View className="flex-1 flex-row" ref={containerRef}>
        {timetables.map((tt, idx) => (
          <View
            key={idx}
            className={cn(
              'relative',
              idx % 2 === 0 ? 'bg-slate-500/5' : 'bg-blue-500/10',
            )}
            style={{
              width: width / numDates,
            }}
          >
            {R.pipe(
              tt.getModel().items,
              R.map(({ style: it, ...rest }) => ({
                ...rest,
                style: {
                  left: it.left * width / numDates,
                  width: it.width * width / numDates,
                  top: it.top * 60000 * H_PER_MS,
                  height: Math.max(it.height * 60000 * H_PER_MS, 28),
                },
              })),
              R.map(({ key, value, style }) => (
                <Pressable
                  key={key}
                  style={style}
                  className={cn(
                    `
                      absolute rounded-xl border border-background bg-primary
                      p-1
                    `,
                  )}
                  onPress={() => {
                    router.push({
                      pathname: '/task/update/[taskId]',
                      params: {
                        taskId: value._id.toString(),
                      },
                    })
                  }}
                  accessibilityLabel={t('timetable.task.label', {
                    summary: value.summary,
                    plannedBegin: value.plannedBegin,
                    plannedEnd: value.plannedEnd,
                    context: isSameDay(value.plannedBegin!, value.plannedEnd!) ? 'sameday' : '',
                  })}
                >
                  <Text className={`
                    text-sm font-semibold text-primary-foreground
                  `}
                  >
                    {value.summary}
                  </Text>
                </Pressable>
              )),
            )}
          </View>
        ))}
      </View>
    </View>
  )
}

export interface TimeTableViewProps {
  anchorDate: Date
  mode: 'day' | '3day'
}

export function TimeTableView({
  anchorDate,
  mode,
}: TimeTableViewProps) {
  const [dateBegin, dateEnd] = mode === 'day'
    ? [anchorDate, addDays(anchorDate, 1)]
    : [addDays(anchorDate, -1), addDays(anchorDate, 2)]

  const taskRecords = useRealmQuery({
    type: TaskRecord,
    query: c =>
      c
        .filtered('plannedBegin > $0', dateBegin)
        .filtered('plannedEnd == null || plannedEnd < $0', dateEnd),
  }, [dateBegin, dateEnd])

  const items: TimeTableItem[] = Array.from(taskRecords)
    .map(item => ({
      from: item.plannedBegin!,
      to: item.plannedEnd ?? addMinutes(item.plannedBegin!, 1),
      item,
    }))

  const timeBegin = R.pipe(
    items,
    R.map(it => Time.fromDate(it.from)),
    item => minBy(item, it => it.getTime()) ?? Time.fromLiteral('00:00'),
    // at least 00:00 and at most 23:00 (1 hour for timeEnd)
    x => clampDate(x, Time.fromLiteral('00:00'), Time.fromLiteral('23:00')),
  ) as Time

  const timeEnd = R.pipe(
    items,
    R.map(it => Time.fromDate(it.to)),
    item => minBy(item, it => -it.getTime()) ?? Time.fromLiteral('24:00'),
    // at least 1 hour after timeBegin and at most 24:00
    x => clampDate(x, addHours(timeBegin, 1), Time.fromLiteral('24:00')),
  ) as Time

  return (
    <TimeTable
      dateBegin={dateBegin}
      dateEnd={dateEnd}
      items={items}
      timeBegin={timeBegin}
      timeEnd={timeEnd}
    />
  )
}
