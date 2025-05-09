import { addDays, startOfDay } from 'date-fns'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { H3 } from '~/components/ui/typography'
import { TaskView } from '~/components/views/task-view'

import { TaskRecord, TaskStatus, useRealmQuery } from '~/lib/realm'
import { useArrayFrom } from '~/lib/use-array-from'

export function TaskListScreen() {
  const router = useRouter()

  const today = startOfDay(new Date())
  const startDate = addDays(today, -7)

  const tasks = {
    pending: useArrayFrom(useRealmQuery({ type: TaskRecord, query: c => c
      .filtered('status == $0', TaskStatus.PENDING)
      .sorted('due') })),
    recent: useArrayFrom(useRealmQuery({ type: TaskRecord, query: c => c
      .filtered('status != $0', TaskStatus.PENDING)
      .filtered('due >= $0 || updated >= $0', startDate) }, [startDate])),
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
      className="flex-1 px-6 py-4"
      edges={['left', 'right']}
    >
      {tasks.pending.length > 0 && (
        <>
          <H3>Pending</H3>
          <TaskView
            tasks={tasks.pending}
            onItemPress={handleItemPress}
          />
        </>
      )}
      {tasks.recent.length > 0 && (
        <>
          <H3>Recently Completed</H3>
          <TaskView
            tasks={tasks.recent}
            onItemPress={handleItemPress}
          />
        </>
      )}
    </SafeAreaView>
  )
}

export default TaskListScreen
