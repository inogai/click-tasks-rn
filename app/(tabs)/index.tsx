import { useQuery } from '@realm/react'
import { endOfDay, endOfMonth, formatDate, startOfDay, startOfMonth } from 'date-fns'
import { Link, useNavigation } from 'expo-router'
import { MicIcon, PlusIcon, SmileIcon } from 'lucide-nativewind'
import * as React from 'react'
import { useMemo } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CalendarStrip } from '~/components/calendar-strip'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { H3 } from '~/components/ui/typography'
import { ExpenseView } from '~/components/views/expense-view'
import { TimelineView } from '~/components/views/timeline-view'
import { VoiceButton } from '~/components/voice-button'

import { t } from '~/lib/i18n'
import { intentionRecognition } from '~/lib/intention-recognition'
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

  async function handleVoiceAccept(message: string) {
    const results = await intentionRecognition(message)

    console.log('Intention recognition results', results)

    // TODO: we will have a dedicated UI to tell the user what items will be created
    // for now we just take the first 1 and send to task/create
    navigation.navigate('task/create', {
      initialValues: results.tasks?.[0],
    })
  }

  return (
    <View className="flex-1 gap-y-4 px-4 py-6">
      <View className="relative mb-2 h-36">
        <CalendarStrip
          className={`
            absolute z-10 rounded-xl border border-border bg-background py-4
          `}
          selectedDate={currentDate}
          onSelectedDateChange={setCurrentDate}
          dots={dots}
        />
      </View>

      <Separator />

      <View>
        <H3 className="pl-2">{t('timeline_view.title')}</H3>
        <TimelineView
          className="h-36 pt-2"
          tasks={tasks as unknown as TaskRecord[]}
          date={currentDate}
        />
      </View>

      <Separator />

      <ExpenseView />

      <Separator />

      <View className="h-[198px] flex-1 items-center justify-center">
        <SmileIcon className="h-[198px] w-[198px] text-green-500" />
      </View>

      <View className="sticky bottom-12 h-14 w-full flex-row px-12">
        <VoiceButton
          onAccept={handleVoiceAccept}
          className="rounded-xl rounded-r-none bg-finance"
          iconClass="text-finance-foreground"
        />
        <View className="w-px border-y-4 border-finance bg-border" />
        <Link href="/task/create" asChild>
          <Button
            size="lg"
            variant="default"
            className="rounded-xl rounded-l-none bg-finance px-4"
          >
            <PlusIcon className="text-finance-foreground" />
          </Button>
        </Link>
      </View>
    </View>
  )
}
