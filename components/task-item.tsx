import type { TaskRecord } from '~/lib/realm'
import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'
import { formatDate } from 'date-fns'
import { CalendarClockIcon, MapPinIcon } from '~/lib/icons'
import * as React from 'react'
import { View } from 'react-native'

import { Checkbox } from '~/components/ui/checkbox'
import { Text } from '~/components/ui/text'

import { TaskStatus } from '~/lib/realm'
import { cn } from '~/lib/utils'

const taskItemDueVariants = cva(
  'text-sm text-muted-foreground',
  {
    variants: {
      isOverdue: {
        true: 'text-destructive',
        false: 'text-muted-foreground',
      },
      icon: {
        true: 'h-4 w-4',
      },
    },
    defaultVariants: {
      isOverdue: false,
      icon: false,
    },
  },
)

export type TaskItemDateVariantsProps = VariantProps<typeof taskItemDueVariants>

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
  const now = new Date()
  const isOverdue = task.due ? task.due < now : false

  return (
    <View className={cn('flex-row items-center gap-4', className)}>
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
            <CalendarClockIcon className={cn(taskItemDueVariants({ isOverdue, icon: true }))} />
            <Text className={cn(taskItemDueVariants({ isOverdue }))}>
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
