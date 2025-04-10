import { useQuery, useRealm } from '@realm/react'
import { FlashList } from '@shopify/flash-list'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Separator } from '~/components/ui/separator'
import { TaskItem } from '~/components/views/task-view'
import { TaskRecord, TaskStatus } from '~/lib/realm'

export default function Screen() {
  const realm = useRealm()
  const tasks = useQuery(TaskRecord)

  function handleCheckedChange(task: TaskRecord, checked: boolean) {
    realm.write(() => {
      task.status = checked ? TaskStatus.COMPLETED : TaskStatus.PENDING
    })
  }

  return (
    <SafeAreaView className="flex-1">
      <FlashList
        ItemSeparatorComponent={() => <Separator className="mx-6" />}
        data={tasks as unknown as TaskRecord[]}
        renderItem={({ item: task }) => (
          <TaskItem
            className="mx-4"
            task={task}
            onCheckedChange={checked =>
              handleCheckedChange(task, checked)}
          />
        )}
        keyExtractor={item => item._id.toString()}
        estimatedItemSize={50}
      />
    </SafeAreaView>
  )
}
