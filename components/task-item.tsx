import type { TaskRecord } from '~/lib/realm'
import { formatDate } from 'date-fns'
import { CalendarClockIcon, MapPinIcon } from 'lucide-nativewind'
import * as React from 'react'
import { View } from 'react-native'
import { Checkbox } from '~/components/ui/checkbox'
import { Text } from '~/components/ui/text'
import { TaskStatus } from '~/lib/realm'
import { cn } from '~/lib/utils'

export interface TaskItemProps {
  task: TaskRecord
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export function TaskItem({
  task,
  onCheckedChange,
  className,
}: TaskItemProps) {
  return (
    <View className={cn('h-20 flex-row items-center gap-4', className)}>
      <Checkbox
        checked={task.status === TaskStatus.COMPLETED}
        onCheckedChange={onCheckedChange ?? (() => {})}
      />

      <View className="h-full grow justify-center">
        <Text className="text-lg font-semibold">
          {task.summary}
        </Text>
        {task.due && (
          <View className="flex-row items-center gap-x-1">
            <CalendarClockIcon className="h-4 w-4 text-muted-foreground" />
            <Text className="text-sm text-muted-foreground">
              Due:
              {' '}
              {formatDate(task.due, 'dd MMM HH:mm')}
            </Text>
          </View>
        )}
        {task.venue && (
          <View className="flex flex-row items-center gap-x-1">
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            <Text className="text-sm text-muted-foreground">
              {task.venue}
            </Text>
          </View>
        )}

      </View>

    </View>
  )
}
