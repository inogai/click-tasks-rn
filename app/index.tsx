import { BanknoteIcon, DollarSignIcon, MicIcon, PlusIcon, SmileIcon } from 'lucide-nativewind'
import * as React from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AmountDisplay } from '~/components/amount-display'
import { AppHeader } from '~/components/AppHeader'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardTitle } from '~/components/ui/card'
import { Label } from '~/components/ui/label'

function ExpenseView() {
  const dailyBalance = -200
  const monthlyBalance = +2000
  const unit = 'HKD'

  return (
    <Card>
      <CardTitle />
      <CardContent>
        <View className="flex-row items-center justify-center">
          <View className="flex-col items-end">
            <Label>Daily</Label>
            <View className="flex-row gap-x-1">
              <DollarSignIcon className="text-foreground" />
              <AmountDisplay amount={dailyBalance} unit={unit} />
            </View>
          </View>

          <View className="mx-4 h-full w-px bg-border" />

          <View className="flex-col items-start">
            <Label>Monthly</Label>
            <View className="flex-row gap-x-1">
              {/* Blocked by lucide-nativewind update */}
              {/* {monthlyBalance > 0 */}
              {/*   ? <BanknoteArrowUpIcon /> */}
              {/*   : <BanknoteArrowDownIcon />} */}
              <BanknoteIcon className="text-foreground" />
              <AmountDisplay amount={monthlyBalance} unit={unit} />
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  )
}

const tasks = [
  { title: 'Task 1', time: 8 },
  { title: 'Task 2', time: 9 },
  { title: 'Task 3', time: 13 },
]

function TasksView() {
  return (
    <View className="flex-col gap-y-2">
      {
        tasks.map(task => (
          <View
            key={task.title}
            className="flex flex-row items-start gap-x-2"
          >
            <Text className="w-12 pt-2.5 text-muted-foreground">
              {task.time.toString().padStart(2, '0')}
              :00
            </Text>
            <View className="grow rounded-xl bg-blue-300 px-4 py-2">
              <Text>{task.title}</Text>
            </View>
          </View>
        ))
      }
    </View>
  )
}

export default function Screen() {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex h-full flex-col items-stretch gap-5 bg-background">
        <AppHeader />
        <View className="grow flex-col gap-y-6 px-4">

          <Text>
            Dates
          </Text>

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
                <Text className="text-xl font-semibold text-primary-foreground">Voice Tasks</Text>
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
