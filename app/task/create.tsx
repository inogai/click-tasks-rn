import type { ITaskRecord } from '~/lib/realm'
import type { SubmitHandler } from 'react-hook-form'

import { useRealm } from '@realm/react'
import { router } from 'expo-router'
import {
  SafeAreaView,
} from 'react-native'

import { TaskForm, useTaskForm } from '~/components/task-form'

import { TaskRecord, TaskStatus } from '~/lib/realm'

type FormData = ITaskRecord

export default function Screen() {
  const realm = useRealm()

  const form = useTaskForm({
    status: TaskStatus.PENDING,
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const task = TaskRecord.create(data)

    realm.write(() => {
      realm.create('Task', task)
    })

    form.reset()
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
