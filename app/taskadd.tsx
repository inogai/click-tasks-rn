import type { SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRealm } from '@realm/react'
import { router } from 'expo-router'
import { CheckIcon } from 'lucide-nativewind'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import {
  SafeAreaView,
  Text,
} from 'react-native'
import { FormField } from '~/components/form/form-field'
import { Button } from '~/components/ui/button'
import { TaskRecord, TaskStatus, taskZod } from '~/lib/realm'

type FormData = z.infer<typeof taskZod>

export default function Screen() {
  const realm = useRealm()

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(taskZod),
    defaultValues: {
      status: TaskStatus.PENDING,
    },
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const task = TaskRecord.create(data)

    realm.write(() => {
      realm.create('Task', task)
    })

    // Navigate back after successful submission
    router.back()
  }

  // trigger validation on every field change
  const watched = useWatch({ control })
  useEffect(() => {
    trigger()
  }, [trigger, watched])

  return (
    <SafeAreaView>
      <FormField
        control={control}
        name="summary"
        label="Task Summary"
        placeholder="Enter task summary"
        className="mb-4"
      />

      <FormField
        control={control}
        name="venue"
        label="Venue"
        placeholder="Enter venue (optional)"
        className="mb-4"
      />

      <FormField
        control={control}
        name="due"
        label="Due Date"
        type="datetime"
        className="mb-4"
      />

      <FormField
        control={control}
        name="plannedBegin"
        label="Planned Begin Date"
        type="datetime"
        className="mb-4"
      />

      <FormField
        name="plannedEnd"
        label="Planned End Date"
        type="datetime"
        control={control}
        className="mb-4"
      />

      <Text className="text-destructive">
        { errors.root?.message }
      </Text>

      <Button
        className="mt-4 flex-row gap-4"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || isSubmitting}
      >
        <CheckIcon className="text-primary-foreground" />
        <Text className="text-primary-foreground">Submit</Text>
      </Button>

    </SafeAreaView>
  )
}
