import type { ITaskRecord } from '~/lib/realm'
import type { SubmitHandler } from 'react-hook-form'

import { useRealm } from '@realm/react'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback } from 'react'
import { SafeAreaView } from 'react-native'
import { z } from 'zod'

import { TaskForm, useTaskForm } from '~/components/task-form'

import { TaskRecord, TaskStatus } from '~/lib/realm'

type FormData = ITaskRecord

const defaultValues: Partial<FormData> = {
  status: TaskStatus.PENDING,
}

export default function Screen() {
  const realm = useRealm()
  const form = useTaskForm()

  // capture initial values if any
  const initialValues = useLocalSearchParams()

  useFocusEffect(useCallback(() => {
    form.reset({
      ...defaultValues,
      ...initialValues,
      status: initialValues.status
        ? z.coerce.number().parse(initialValues.status)
        : undefined,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []))

  const handleSubmit: SubmitHandler<FormData> = (data) => {
    const task = TaskRecord.create(data)

    realm.write(() => {
      realm.create(TaskRecord, task)
    })

    form.reset({ ...defaultValues })
    // Navigate back after successful submission
    router.back()
  }

  return (
    <SafeAreaView>
      <TaskForm
        form={form}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  )
}
