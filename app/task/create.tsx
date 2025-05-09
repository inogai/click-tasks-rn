import type { ITaskRecord } from '~/lib/realm'
import type { SubmitHandler } from 'react-hook-form'

import { useRealm } from '@realm/react'
import { addMilliseconds, endOfMinute } from 'date-fns'
import { router, useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { SafeAreaView } from 'react-native'

import { TaskForm, useTaskForm } from '~/components/task-form'

import { Alarm, Countdown, TaskRecord, TaskStatus } from '~/lib/realm'

type FormData = ITaskRecord

const defaultValues: Partial<FormData> = {
  status: TaskStatus.PENDING,
}

export default function Screen() {
  const realm = useRealm()
  const form = useTaskForm()

  useFocusEffect(useCallback(() => {
    form.reset()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []))

  const handleSubmit: SubmitHandler<FormData> = (data) => {
    realm.write(() => {
      const task = realm.create(TaskRecord, TaskRecord.create(data))

      if (data.addToCountdown) {
        Countdown.create(task, realm)
      }

      if (data.plannedBegin && data.alarm !== -1) {
        Alarm.create({
          task,
          time: addMilliseconds(data.plannedBegin, -data.alarm),
        }, realm)
      }
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
