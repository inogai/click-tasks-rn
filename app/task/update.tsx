import type { SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'
import type { taskZod } from '~/lib/realm'
import { useRealm } from '@realm/react'

import { router, useNavigation } from 'expo-router'

import { SafeAreaView } from 'react-native'
import { BSON } from 'realm'

import { TaskForm } from '~/components/task-form'
import { TaskRecord } from '~/lib/realm'
import { useRoute } from '~/lib/routes'

type FormData = z.infer<typeof taskZod>

export function TaskUpdateScreen() {
  // navigation
  const route = useRoute<'task/update'>()
  const navigation = useNavigation()
  const { taskId = '' } = route.params ?? {}

  const realm = useRealm()

  const task = realm.objectForPrimaryKey(TaskRecord, new BSON.ObjectId(taskId))

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
        defaultValues={{ ...task }}
        onSubmit={onSubmit}
      />
    </SafeAreaView>
  )
}

export default TaskUpdateScreen
