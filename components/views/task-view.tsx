import type { TaskRecord } from '~/lib/realm'

import { FlashList } from '@shopify/flash-list'
import { View } from 'react-native'

import { TaskItem } from '~/components/task-item'
import { Pressable } from '~/components/ui/pressable'
import { Separator } from '~/components/ui/separator'

import { cn } from '~/lib/utils'

interface TaskViewProps {
  tasks: TaskRecord[]
  className?: string
  onItemPress?: (task: TaskRecord) => void
}

export function TaskView({
  tasks,
  className,
  onItemPress,
}: TaskViewProps) {
  return (
    <View className={cn('flex-1', className)} style={{ maxHeight: 100 * tasks.length }}>
      <FlashList
        data={tasks}
        estimatedItemSize={70}
        keyExtractor={item => item._id.toString()}
        ItemSeparatorComponent={() =>
          <Separator className="mx-6" />}
        renderItem={({ item: task }) => (
          <View className="m-2 overflow-hidden rounded-xl">
            <Pressable
              onPress={() => { onItemPress?.(task) }}
            >
              <TaskItem
                className="py-2"
                task={task}
              />
            </Pressable>
          </View>
        )}
      />
    </View>
  )
}
