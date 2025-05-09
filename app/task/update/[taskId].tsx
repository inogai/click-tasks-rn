import type { ITaskRecord } from '~/lib/realm'
import type { SubmitHandler } from 'react-hook-form'

import { useObject, useRealm } from '@realm/react'
import { addMilliseconds } from 'date-fns'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect, useMemo } from 'react'
import { SafeAreaView } from 'react-native'
import { BSON } from 'realm'

import { TaskForm, useTaskForm } from '~/components/task-form'

import { Alarm, Countdown, TaskRecord } from '~/lib/realm'

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
    form.reset({
      plannedBegin: null, // a little trick to ensure they are reset
      plannedEnd: null, // so that it will not trigger the useEffect
      ...task,
    }, {
      keepDefaultValues: true,
    })
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
    <SafeAreaView>
      <TaskForm
        form={form}
        onSubmit={onSubmit}
      />
    </SafeAreaView>
  )
}

export default TaskUpdateScreen
