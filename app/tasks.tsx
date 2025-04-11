import { useQuery, useRealm } from '@realm/react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TaskView } from '~/components/views/task-view'
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
      <TaskView
        tasks={Array.from(tasks)}
        onCheckedChange={handleCheckedChange}
      />
    </SafeAreaView>
  )
}
