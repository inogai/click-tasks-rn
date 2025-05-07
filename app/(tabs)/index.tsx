import { useQuery } from '@realm/react'
import { endOfDay, endOfMonth, formatDate, startOfDay, startOfMonth } from 'date-fns'
import { useNavigation } from 'expo-router'
import * as React from 'react'
import { useMemo } from 'react'
import { View } from 'react-native'

import { CalendarStrip } from '~/components/calendar-strip'
import { Separator } from '~/components/ui/separator'
import { H3 } from '~/components/ui/typography'
import { ExpenseView } from '~/components/views/expense-view'
import { TimeTableView } from '~/components/views/timetable-view'

import { t } from '~/lib/i18n'
import { TaskRecord, TaskStatus } from '~/lib/realm'

export default function Screen() {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const tasks = useQuery({
    type: TaskRecord,
    query: collection => collection
      .filtered(
        'plannedEnd <= $1 && plannedBegin >= $0',
        startOfDay(currentDate),
        endOfDay(currentDate),
      )
      .sorted('due'),
  }, [currentDate])

  const tasksInMonth = useQuery({
    type: TaskRecord,
    query: collection => collection
      .filtered(
        'due >= $0 && due <= $1 && status == $2',
        startOfMonth(currentDate),
        endOfMonth(currentDate),
        TaskStatus.PENDING,
      )
      .sorted('due'),
    // I think this might have performance issues
    // Let's see if we can optimize it later
  }, [currentDate])

  const dots = useMemo(
    () => {
      const result: Record<string, number> = {}

      for (const task of tasksInMonth) {
        if (!task.due)
          continue

        const date = formatDate(task.due, 'yyyy-MM-dd')
        result[date] = (result[date] ?? 0) + 1
      }

      return result
    },
    [tasksInMonth],
  )

  const navigation = useNavigation()

  return (
    <View className="flex-1 gap-y-4 px-4 py-6">
      <View className="relative mb-2 h-36">
        <CalendarStrip
          dots={dots}
          selectedDate={currentDate}
          className={`
            absolute z-10 rounded-xl border border-border bg-background py-4
          `}
          onSelectedDateChange={setCurrentDate}
        />
      </View>

      <Separator />

      <ExpenseView />

      <Separator />

      <TimeTableView anchorDate={currentDate} />
    </View>
  )
}
