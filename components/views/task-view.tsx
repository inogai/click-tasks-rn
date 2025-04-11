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
  onCheckedChange?: (task: TaskRecord, checked: boolean) => void
  onItemPress?: (task: TaskRecord) => void
}

export function TaskView({
  tasks,
  className,
  onCheckedChange,
  onItemPress,
}: TaskViewProps) {
  return (
    <View className={cn('flex-1', className)}>
      <FlashList
        ItemSeparatorComponent={() =>
          <Separator className="mx-6" />}
        data={tasks}
        renderItem={({ item: task }) => (
          <View className="m-2 overflow-hidden rounded-xl">
            <Pressable
              onPress={() => { onItemPress?.(task) }}
            >
              <TaskItem
                className="px-4 py-2"
                task={task}
                onCheckedChange={checked =>
                  onCheckedChange?.(task, checked)}
              />
            </Pressable>
          </View>
        )}
        keyExtractor={item => item._id.toString()}
        estimatedItemSize={70}
      />
    </View>
  )
}
