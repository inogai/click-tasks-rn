import type { taskZod } from '~/lib/realm'
import type { SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'

import { useObject, useRealm } from '@realm/react'
import { router, useNavigation } from 'expo-router'
import { useEffect, useMemo } from 'react'
import { SafeAreaView } from 'react-native'
import { BSON } from 'realm'

import { TaskForm, useTaskForm } from '~/components/task-form'

import { TaskRecord } from '~/lib/realm'
import { useRoute } from '~/lib/routes'

type FormData = z.infer<typeof taskZod>

export function TaskUpdateScreen() {
  // navigation
  const route = useRoute<'task/update'>()
  const navigation = useNavigation()
  const { taskId = '' } = route.params ?? {}

  const realm = useRealm()

  const task = useObject({
    type: TaskRecord,
    primaryKey: new BSON.ObjectId(taskId),
  })
  const defaultValues = useMemo(() => ({ ...task }), [task])

  const form = useTaskForm()

  // trigger reset when task changes
  useEffect(() => {
    form.reset(defaultValues)
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
    })

    // Navigate back after successful submission
    router.back()
  }

  return (
    <SafeAreaView>
      <TaskForm
        form={form}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </SafeAreaView>
  )
}

export default TaskUpdateScreen
