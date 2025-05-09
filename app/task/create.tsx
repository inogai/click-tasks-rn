import type { ITaskRecord } from '~/lib/realm'
import type { SubmitHandler } from 'react-hook-form'

import { useRealm } from '@realm/react'
import { router, useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { TaskForm, useTaskForm } from '~/components/task-form'

import { TaskRecord } from '~/lib/realm'

type FormData = ITaskRecord

export default function Screen() {
  const realm = useRealm()
  const form = useTaskForm()

  useFocusEffect(useCallback(() => {
    form.reset()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []))

  const handleSubmit: SubmitHandler<FormData> = (data) => {
    realm.write(() => {
      TaskRecord.create(data, realm)
    })

    form.reset()
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
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  )
}
