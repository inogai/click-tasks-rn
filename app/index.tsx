import { useQuery } from '@realm/react'
import { endOfDay, startOfDay } from 'date-fns'
import { Link } from 'expo-router'
import { MicIcon, PlusIcon, SmileIcon } from 'lucide-nativewind'
import * as React from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppHeader } from '~/components/app-header'
import { CalendarStrip } from '~/components/calendar-strip'
import { ExpenseView } from '~/components/expense-view'
import { TasksView } from '~/components/task-view'
import { Button } from '~/components/ui/button'

import { t } from '~/lib/i18n'
import { TaskRecord } from '~/lib/realm'

export default function Screen() {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const tasks = useQuery({
    type: TaskRecord,
    query: collection => collection
      .filtered(
        'due >= $0 && due <= $1',
        startOfDay(currentDate),
        endOfDay(currentDate),
      )
      .sorted('due'),
  })

  console.log('tasks', tasks)

  return (
    <SafeAreaView className="flex-1">
      <View className="flex h-full flex-col items-stretch gap-5 bg-background">
        <AppHeader />
        <View className="grow flex-col justify-stretch gap-y-2 px-4">
          <View className="relative h-36">
            <CalendarStrip
              className={`
                absolute z-10 rounded-xl border border-border bg-background py-4
              `}
              selectedDate={currentDate}
              onSelectedDateChange={setCurrentDate}
              initialExpaned={true}
            />
          </View>

          <ExpenseView />

          <TasksView className="h-36 p-2" tasks={tasks as unknown as TaskRecord[]} />

          <View className="h-[198px] flex-1 items-center justify-center">
            <SmileIcon className="h-[198px] w-[198px] text-green-500" />
          </View>

          <View className="sticky bottom-12 w-full flex-row px-12">
            <Button
              variant="default"
              size="lg"
              className="grow rounded-xl rounded-r-none bg-finance"
            >
              <View className="flex flex-row items-center gap-2">
                <MicIcon className="text-finance-foreground" />
                <Text className="text-xl font-semibold text-finance-foreground">
                  {t('voice_button')}
                </Text>
              </View>
            </Button>
            <View className="w-px border-y-4 border-finance bg-border" />
            <Link href="/taskadd" asChild>
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
      </View>
    </SafeAreaView>
  )
}
