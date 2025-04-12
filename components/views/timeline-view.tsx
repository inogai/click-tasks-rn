import type { TaskRecord } from '~/lib/realm'

import { useRealm } from '@realm/react'
import { formatDate } from 'date-fns'
import { MapPinIcon } from 'lucide-nativewind'
import * as React from 'react'
import { Text, View } from 'react-native'

import { Checkbox } from '~/components/ui/checkbox'
import { Muted } from '~/components/ui/typography'

import { t } from '~/lib/i18n'
import { TaskStatus } from '~/lib/realm'
import { cn } from '~/lib/utils'

interface TimelineViewProps {
  tasks: TaskRecord[]
  className?: string
}

export function TimelineView({
  tasks,
  className,
}: TimelineViewProps) {
  const realm = useRealm()

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
              className="flex flex-row items-center gap-x-2"
            >
              {task.due && (
                <Text className="w-12 pt-2.5 text-muted-foreground">
                  {formatDate(task.due, 'HH:mm')}
                </Text>
              )}
              <View>
                <Checkbox
                  checked={task.status === TaskStatus.COMPLETED}
                  onCheckedChange={() => {
                    realm.write(() => {
                      task.update({
                        status: task.status === TaskStatus.COMPLETED
                          ? TaskStatus.PENDING
                          : TaskStatus.COMPLETED,
                      })
                    })
                  }}
                />
              </View>
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
        : <Muted>{t('timeline_view.placeholder')}</Muted>}
    </View>
  )
}
