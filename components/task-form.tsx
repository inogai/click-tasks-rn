import type { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon } from 'lucide-nativewind'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Text, View } from 'react-native'

import { FormField } from '~/components/form/form-field'
import { SelectField } from '~/components/form/select-field'
import { Button } from '~/components/ui/button'

import { t } from '~/lib/i18n'
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
        label={t('task_form.summary.label')}
        placeholder="Enter task summary"
        className="mb-4"
      />

      <FormField
        control={control}
        name="venue"
        label={t('task_form.venue.label')}
        placeholder="Enter venue (optional)"
        className="mb-4"
      />

      <FormField
        control={control}
        name="due"
        label={t('task_form.due.label')}
        type="datetime"
        className="mb-4"
      />

      <FormField
        control={control}
        name="plannedBegin"
        label={t('task_form.planned_begin.label')}
        type="datetime"
        className="mb-4"
      />

      <FormField
        name="plannedEnd"
        label={t('task_form.planned_end.label')}
        type="datetime"
        control={control}
        className="mb-4"
      />

      <SelectField
        name="status"
        label={t('task_form.status.label')}
        control={control}
        className="mb-4"
        options={[
          { label: t('task_form.status.values.pending'), value: TaskStatus.PENDING },
          { label: t('task_form.status.values.completed'), value: TaskStatus.COMPLETED },
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
        <Text className="text-primary-foreground">
          {t('button.submit')}
        </Text>
      </Button>

    </View>
  )
}
