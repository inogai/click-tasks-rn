import { MicIcon, PlusIcon, SmileIcon } from 'lucide-nativewind'
import * as React from 'react'
import { Text, View } from 'react-native'
import { Agenda, CalendarProvider, ExpandableCalendar, TimelineList } from 'react-native-calendars'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppHeader } from '~/components/app-header'
import { CalendarStrip } from '~/components/calendar-strip'
import { ExpenseView } from '~/components/expense-view'
import { TasksView } from '~/components/task-view'
import { Button } from '~/components/ui/button'

export default function Screen() {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  return (
    <SafeAreaView className="flex-1">
      <View className="flex h-full flex-col items-stretch gap-5 bg-background">
        <AppHeader />
        <View className="grow flex-col justify-stretch gap-y-6 px-4">
          <CalendarStrip
            selectedDate={currentDate}
            onSelectedDateChange={setCurrentDate}
            expanded={false}
          />

          <ExpenseView />

          <TasksView />

          <View className="h-[198px] flex-1 items-center justify-center">
            <SmileIcon className="h-[198px] w-[198px] text-green-500" />
          </View>

          <View className="sticky bottom-12 w-full flex-row px-16">
            <Button
              variant="default"
              size="lg"
              className={`
                grow rounded-xl rounded-r-none border-r-4 border-background
              `}
            >
              <View className="flex flex-row items-center gap-2">
                <MicIcon className="text-primary-foreground" />
                <Text className="text-xl font-semibold text-primary-foreground">
                  Voice Tasks
                </Text>
              </View>
            </Button>
            <Button
              size="lg"
              variant="default"
              className="rounded-xl rounded-l-none px-4"
            >
              <PlusIcon className="text-primary-foreground" />
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
