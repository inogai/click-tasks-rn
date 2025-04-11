import type { TaskRecord } from '~/lib/realm'
import { FlashList } from '@shopify/flash-list'
import { View } from 'react-native'
import { TaskItem } from '~/components/task-item'
import { Separator } from '~/components/ui/separator'
import { cn } from '~/lib/utils'

interface TaskViewProps {
  tasks: TaskRecord[]
  className?: string
  onCheckedChange?: (task: TaskRecord, checked: boolean) => void
}

export function TaskView({
  tasks,
  className,
  onCheckedChange,
}: TaskViewProps) {
  return (
    <View className={cn('flex-1', className)}>
      <FlashList
        ItemSeparatorComponent={() =>
          <Separator className="mx-6" />}
        data={tasks}
        renderItem={({ item: task }) => (
          <TaskItem
            className="mx-4"
            task={task}
            onCheckedChange={checked =>
              onCheckedChange?.(task, checked)}
          />
        )}
        keyExtractor={item => item._id.toString()}
        estimatedItemSize={70}
      />
    </View>
  )
}
