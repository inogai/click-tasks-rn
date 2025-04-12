import type { SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'
import type { taskZod } from '~/lib/realm'
import { useRealm } from '@realm/react'

import { router } from 'expo-router'
import {
  SafeAreaView,
} from 'react-native'
import { TaskForm } from '~/components/task-form'
import { TaskRecord, TaskStatus } from '~/lib/realm'

type FormData = z.infer<typeof taskZod>

export default function Screen() {
  const realm = useRealm()

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const task = TaskRecord.create(data)

    realm.write(() => {
      realm.create('Task', task)
    })

    // Navigate back after successful submission
    router.back()
  }

  return (
    <SafeAreaView>
      <TaskForm
        defaultValues={{
          status: TaskStatus.PENDING,
        }}
        onSubmit={onSubmit}
      />
    </SafeAreaView>
  )
}
