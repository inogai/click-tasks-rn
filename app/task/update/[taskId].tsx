import type { ITaskRecord } from '~/lib/realm'
import type { SubmitHandler } from 'react-hook-form'

import { useObject, useRealm } from '@realm/react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect, useMemo } from 'react'
import { SafeAreaView } from 'react-native'
import { BSON } from 'realm'

import { TaskForm, useTaskForm } from '~/components/task-form'
import { Button } from '~/components/ui/button'

import { Countdown, TaskRecord } from '~/lib/realm'

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
  const defaultValues = useMemo(() => ({ ...task }), [task])

  const form = useTaskForm()

  // trigger reset when task changes
  useEffect(() => {
    form.reset({
      ...defaultValues,
      addToCountdown: Countdown.existsByTaskRecord(task!, realm),
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues])

  if (!task) {
    return (
      navigation.goBack()
    )
  }

  const onSubmit: SubmitHandler<FormData> = (data) => {
    realm.write(() => {
      task.update(data)
      Countdown.deleteByTaskRecord(task, realm)

      if (data.addToCountdown) {
        Countdown.create(task, realm)
      }
    })

    // Navigate back after successful submission
    router.back()
  }

  return (
    <SafeAreaView>
      <TaskForm
        defaultValues={defaultValues}
        form={form}
        onSubmit={onSubmit}
      />
    </SafeAreaView>
  )
}

export default TaskUpdateScreen
