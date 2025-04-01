import { MicIcon, PlusIcon, SmileIcon } from 'lucide-nativewind'
import * as React from 'react'
import { Text, View } from 'react-native'
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

          <TasksView />

          <View className="h-[198px] flex-1 items-center justify-center">
            <SmileIcon className="h-[198px] w-[198px] text-green-500" />
          </View>

          <View className="sticky bottom-12 w-full flex-row px-12">
            <Button
              variant="default"
              size="lg"
              className="bg-finance grow rounded-xl rounded-r-none"
            >
              <View className="flex flex-row items-center gap-2">
                <MicIcon className="text-finance-foreground" />
                <Text className="text-finance-foreground text-xl font-semibold">
                  Voice Tasks
                </Text>
              </View>
            </Button>
            <View className="border-finance w-px border-y-4 bg-border" />
            <Button
              size="lg"
              variant="default"
              className="bg-finance rounded-xl rounded-l-none px-4"
            >
              <PlusIcon className="text-finance-foreground" />
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
