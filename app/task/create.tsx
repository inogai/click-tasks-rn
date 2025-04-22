import type { ITaskRecord } from '~/lib/realm'
import type { SubmitHandler } from 'react-hook-form'

import { useRealm } from '@realm/react'
import { router } from 'expo-router'
import { useEffect } from 'react'
import {
  SafeAreaView,
} from 'react-native'

import { TaskForm, useTaskForm } from '~/components/task-form'

import { TaskRecord, TaskStatus } from '~/lib/realm'
import { useRoute } from '~/lib/routes'

type FormData = ITaskRecord

export default function Screen() {
  const route = useRoute<'task/create'>()
  const initialValues = route.params?.initialValues

  const realm = useRealm()

  const form = useTaskForm({
    status: TaskStatus.PENDING,
  })

  useEffect(() => {
    form.reset(initialValues)
  }, [initialValues])

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const task = TaskRecord.create(data)

    realm.write(() => {
      realm.create('Task', task)
    })

    form.reset({})
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
