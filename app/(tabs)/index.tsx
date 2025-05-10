import { Header } from '@react-navigation/elements'
import { useQuery } from '@realm/react'
import { addDays, endOfMonth, formatDate, startOfMonth } from 'date-fns'
import { router } from 'expo-router'
import * as React from 'react'
import { useMemo } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CalendarStrip } from '~/components/calendar-strip'
import { Button } from '~/components/ui/button'
import { Card, CardHeader } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { CountdownView } from '~/components/views/countdown-view'
import { ExpenseView } from '~/components/views/expense-view'
import { TimeTableView } from '~/components/views/timetable-view'

import { t } from '~/lib/i18n'
import { Calendar1Icon, CalendarIcon, NotepadTextIcon } from '~/lib/icons'
import { TaskRecord, TaskStatus } from '~/lib/realm'
import { dateRange, TimeDelta } from '~/lib/utils'

export default function Screen() {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const tasksInMonth = useQuery({
    type: TaskRecord,
    query: collection => collection
      .filtered([
        'plannedBegin <= $1 && plannedEnd >= $0',
        'plannedEnd == null && plannedBegin >= $0 && plannedBegin <= $1',
      ]
        .map(it => `(${it})`)
        .join('||'), // ensure overlap
      startOfMonth(currentDate), endOfMonth(currentDate))
      .sorted('plannedBegin'),
  }, [currentDate])

  const dots = useMemo(
    () => {
      const result: Record<string, number> = {}

      for (const task of tasksInMonth) {
        if (!task.plannedBegin) {
          continue
        }

        for (const date of dateRange(
          task.plannedBegin,
          task.plannedEnd ?? addDays(task.plannedBegin, 1),
          TimeDelta.DAY(1),
        )) {
          const dateStr = formatDate(date, 'yyyy-MM-dd')
          result[dateStr] = (result[dateStr] ?? 0) + 1
        }
      }

      return result
    },
    [tasksInMonth],
  )

  const timetableModes = [
    { label: t('timetable.mode.day'), value: 'day' },
    { label: t('timetable.mode.3day'), value: '3day' },
  ] as const
  type TimetableMode = (typeof timetableModes)[number]['value']
  const [timetableMode, setTimetableMode] = React.useState<TimetableMode>('day')

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right', 'bottom']}>
      <Header
        title={t('routes.(tabs).index')}
        headerRight={() => (
          <View className="mr-4 flex-row items-center gap-x-2">
            <Button
              size="icon"
              variant="ghost"
              onPress={() => {
                const idx = timetableModes.findIndex(m => m.value === timetableMode) + 1
                setTimetableMode(timetableModes[idx % timetableModes.length].value)
              }}
              accessibilityLabel={timetableModes.find(m => m.value === timetableMode)?.label}
            >
              {timetableMode === 'day' && <Calendar1Icon />}
              {timetableMode === '3day' && <CalendarIcon />}
            </Button>

            <Button
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
          </View>
        )}
      />

      <View className="flex-1 gap-y-4 px-4 py-6">
        <CountdownView />

        <View className="relative mb-2 h-36">
          <Card className="absolute z-10 bg-background">
            <CardHeader className="px-2 py-4">
              <CalendarStrip
                dots={dots}
                selectedDate={currentDate}
                onSelectedDateChange={setCurrentDate}
              />
            </CardHeader>
          </Card>
        </View>

        <Separator />

        <ExpenseView anchorDate={currentDate} />

        <Separator />

        <TimeTableView anchorDate={currentDate} mode={timetableMode} />
      </View>
    </SafeAreaView>
  )
}
