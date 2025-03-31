import * as React from 'react'
import { Text, View } from 'react-native'

const tasks = [
  { title: 'Task 1', time: 8 },
  { title: 'Task 2', time: 9 },
  { title: 'Task 3', time: 13 },
]

export function TasksView() {
  return (
    <View className="flex-col gap-y-2">
      {tasks.map(task => (
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
      ))}
    </View>
  )
}
