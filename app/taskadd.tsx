import type { SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useRealm } from '@realm/react'
import { router } from 'expo-router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Keyboard,
  SafeAreaView,
  TouchableWithoutFeedback,
  Text
} from 'react-native'
import { DateInput } from '~/components/date-input'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { TaskRecord, TaskStatus, taskZod } from '~/lib/realm'
import { CheckIcon } from 'lucide-nativewind'
import { Button } from '~/components/ui/button'

type FormData = z.infer<typeof taskZod>

export default function Screen() {
  const realm = useRealm()

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
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

  return (
    <SafeAreaView>
      <Label nativeID="summary">Task Summary</Label>
      <Controller
        control={control}
        name="summary"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            nativeID="summary"
            placeholder="Task Summary"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Label nativeID="venue">Venue</Label>
      <Controller
        control={control}
        name="venue"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            nativeID="venue"
            placeholder="Venue"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Label nativeID="due">Due Date</Label>
      <Controller
        control={control}
        name="due"
        render={({ field: { onChange, onBlur, value } }) => (
          <DateInput
            nativeID="due"
            value={value}
            onValueChange={onChange}
          />
        )}
      />

      <Button 
        className="mt-4 flex-row gap-4" onPress={handleSubmit(onSubmit)} disabled={!isValid || isSubmitting}>
        <CheckIcon className='text-primary-foreground' />
        <Text className='text-primary-foreground'>Submit</Text>
      </Button>

    </SafeAreaView>
  )
}
