import type { TaskRecord } from '~/lib/realm'
import { formatDate } from 'date-fns'
import { MapPinIcon } from 'lucide-nativewind'
import * as React from 'react'
import { Text, View } from 'react-native'
import { Muted } from '~/components/ui/typography'
import { cn } from '~/lib/utils'

interface TasksViewProps {
  tasks: TaskRecord[]
  className?: string
}

export function TasksView({
  tasks,
  className,
}: TasksViewProps) {
  return (
    <View className={cn(
      `flex-col items-center justify-start gap-y-2`,
      className,
    )}
    >
      {tasks.length
        ? tasks.map(task => (
            <View
              key={task._id.toString()}
              className="flex flex-row items-start gap-x-2"
            >
              {task.due && (
                <Text className="w-12 pt-2.5 text-muted-foreground">
                  {formatDate(task.due, 'HH:mm')}
                </Text>
              )}
              <View className="grow rounded-xl bg-primary px-4 py-2">
                <Text className="font-semibold text-primary-foreground">{task.summary}</Text>
                {task.venue && (
                  <View className="flex flex-row items-center gap-x-1">
                    <MapPinIcon className="h-4 w-4 text-primary-foreground" />
                    <Text className="text-sm text-primary-foreground">
                      {task.venue}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))
        : <Muted>No Tasks Today.</Muted>}
    </View>
  )
}
