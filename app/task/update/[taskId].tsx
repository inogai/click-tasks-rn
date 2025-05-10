import type { ITaskRecord } from '~/lib/realm'
import type { SubmitHandler } from 'react-hook-form'

import { useObject, useRealm } from '@realm/react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BSON } from 'realm'

import { TaskForm, useTaskForm } from '~/components/task-form'

import { TaskRecord } from '~/lib/realm'

type FormData = ITaskRecord

export function TaskUpdateScreen() {
  // navigation
  const { taskId } = useLocalSearchParams<'/task/update/[taskId]'>()
  const navigation = useNavigation()

  const realm = useRealm()

  const task = useObject({
    type: TaskRecord,
    primaryKey: new BSON.ObjectId(taskId),
  })

  const form = useTaskForm()

  // trigger reset when task changes
  useEffect(() => {
    form.reset(task?.toFormValues(), {
      keepDefaultValues: true,
    })
    form.trigger()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task])

  if (!task) {
    return (
      navigation.goBack()
    )
  }

  const onSubmit: SubmitHandler<FormData> = (data) => {
    realm.write(() => {
      task.update(data, realm)
    })

    // Navigate back after successful submission
    router.back()
  }

  return (
    <SafeAreaView
      className="flex-1 px-6 py-4"
      edges={['left', 'right', 'bottom']}
    >
      <TaskForm
        form={form}
        onSubmit={onSubmit}
      />
    </SafeAreaView>
  )
}

export default TaskUpdateScreen
