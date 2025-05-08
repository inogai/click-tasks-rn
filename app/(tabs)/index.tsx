import { Header } from '@react-navigation/elements'
import { useQuery } from '@realm/react'
import { endOfMonth, formatDate, startOfMonth } from 'date-fns'
import { router, useNavigation } from 'expo-router'
import * as React from 'react'
import { useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CalendarStrip } from '~/components/calendar-strip'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Text, View } from '~/components/ui/text'
import { ExpenseView } from '~/components/views/expense-view'
import { TimeTableView } from '~/components/views/timetable-view'

import { t } from '~/lib/i18n'
import { NotepadTextIcon } from '~/lib/icons'
import { TaskRecord, TaskStatus } from '~/lib/realm'

export default function Screen() {
  const [currentDate, setCurrentDate] = React.useState(new Date())

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

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right', 'bottom']}>
      <Header
        title={t('routes.(tabs).index')}
        headerRight={() => (
          <Button
            className="mr-4"
            size="icon"
            variant="ghost"
            onPress={() => {
              router.push({
                pathname: '/prod-summary/monthly/[date]',
                params: {
                  date: formatDate(currentDate, 'yyyy-MM-dd'),
                },
              })
            }}
            accessibilityLabel={t('routes.prod-summary.monthly')}
          >
            <NotepadTextIcon />
          </Button>
        )}
      />

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

        <ExpenseView anchorDate={currentDate} />

        <Separator />

        <TimeTableView anchorDate={currentDate} />
      </View>
    </SafeAreaView>
  )
}
