import type { TaskRecord } from '~/lib/realm'
import type { VariantProps } from 'class-variance-authority'

import { useRealm } from '@realm/react'
import { cva } from 'class-variance-authority'
import { formatDate } from 'date-fns'
import * as React from 'react'
import { View } from 'react-native'

import { CheckboxLike } from '~/components/ui/checkbox-like'
import { Text } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { CalendarClockIcon, CheckIcon, MapPinIcon, MinusIcon, XIcon } from '~/lib/icons'
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
  className?: string
}

export function TaskItem({
  task,
  className,
}: TaskItemProps) {
  const realm = useRealm()

  const now = new Date()
  const isOverdue = (task.status === TaskStatus.PENDING && task.plannedBegin) ? task.plannedBegin < now : false

  return (
    <View className={cn('flex-row items-center gap-4 px-2', className)}>
      <CheckboxLike
        value={task.status}
        options={[
          { value: TaskStatus.PENDING, label: t('task_form.status.values.pending'), icon: CheckIcon, indicatorClass: 'opacity-0' },
          { value: TaskStatus.COMPLETED, label: t('task_form.status.values.completed'), rootClass: 'bg-primary', icon: CheckIcon },
          { value: TaskStatus.OVERDUE_COMPLETED, label: t('task_form.status.values.overdue_completed'), rootClass: 'bg-primary', icon: MinusIcon },
          { value: TaskStatus.DELETED, label: t('task_form.status.values.pending'), rootClass: 'border-muted-foreground bg-muted-foreground', icon: XIcon },
        ]}
        onPressed={(currentValue) => {
          realm.write(() => {
            if (currentValue !== TaskStatus.PENDING) {
              task.status = TaskStatus.PENDING
              return
            }

            if (isOverdue) {
              task.status = TaskStatus.OVERDUE_COMPLETED
              return
            }

            task.status = TaskStatus.COMPLETED
          })
        }}
      />

      <View className="h-full grow justify-center">
        <Text className="text-lg font-semibold">
          {task.summary}
        </Text>
        {task.plannedBegin && (
          <View className="flex-row items-center gap-x-1">
            <CalendarClockIcon className={cn(taskItemDueVariants({ isOverdue, icon: true }))} />
            <Text className={cn(taskItemDueVariants({ isOverdue }))}>
              {formatDate(task.plannedBegin, 'dd MMM HH:mm')}
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
