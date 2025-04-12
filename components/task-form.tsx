import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon } from 'lucide-nativewind'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Text, View } from 'react-native'

import { FormField } from '~/components/form/form-field'
import { SelectField } from '~/components/form/select-field'
import { Button } from '~/components/ui/button'
import { TaskStatus, taskZod } from '~/lib/realm'

type FormData = z.infer<typeof taskZod>

interface TaskFormProps {
  defaultValues?: Partial<FormData>
  onSubmit: (data: FormData) => void
}

export function TaskForm({
  defaultValues,
  onSubmit,
}: TaskFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(taskZod),
    defaultValues,
  })

  // trigger validation on every field change
  const watched = useWatch({ control })
  useEffect(() => {
    trigger()
  }, [trigger, watched])

  return (
    <View>
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

      <SelectField
        name="status"
        label="Status"
        control={control}
        className="mb-4"
        options={[
          { label: 'Pending', value: TaskStatus.PENDING },
          { label: 'Completed', value: TaskStatus.COMPLETED },
        ]}
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

    </View>
  )
}
