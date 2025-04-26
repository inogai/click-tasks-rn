import { useQuery, useRealm } from '@realm/react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { TaskView } from '~/components/views/task-view'

import { TaskRecord, TaskStatus } from '~/lib/realm'

export function TaskListScreen() {
  const router = useRouter()

  const realm = useRealm()
  const tasks = useQuery(TaskRecord)

  function handleCheckedChange(task: TaskRecord, checked: boolean) {
    realm.write(() => {
      task.status = checked ? TaskStatus.COMPLETED : TaskStatus.PENDING
    })
  }

  function handleItemPress(task: TaskRecord) {
    router.navigate({
      pathname: '/task/update/[taskId]',
      params: {
        taskId: task._id.toString(),
      },
    })
  }

  return (
    <SafeAreaView
      edges={['left', 'right']}
      className="flex-1"
    >
      <TaskView
        tasks={Array.from(tasks)}
        onCheckedChange={handleCheckedChange}
        onItemPress={handleItemPress}
      />
    </SafeAreaView>
  )
}

export default TaskListScreen
