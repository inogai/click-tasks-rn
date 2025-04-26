import type { ITaskRecord } from '~/lib/realm'
import type { UseFormReturn } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { addHours, addMilliseconds, differenceInMilliseconds } from 'date-fns'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Text, View } from 'react-native'

import { FormField } from '~/components/form/form-field'
import { SelectField } from '~/components/form/select-field'
import { Button } from '~/components/ui/button'

import { t } from '~/lib/i18n'
import { CheckIcon } from '~/lib/icons'
import { TaskRecord, TaskStatus } from '~/lib/realm'
import { usePrevious } from '~/lib/use-previous'

type FormData = ITaskRecord

interface TaskFormProps {
  defaultValues?: Partial<FormData>
  onSubmit: (data: FormData) => void
  form: UseFormReturn<FormData>
}

export function useTaskForm(defaultValues?: Partial<FormData>) {
  return useForm<FormData>({
    resolver: zodResolver(TaskRecord.zodSchema),
    defaultValues,
  })
}

function getNewEnd(
  oldBegin: Date | null | undefined,
  oldEnd: Date | null | undefined,
  newBegin: Date | null | undefined,
) {
  if (!newBegin)
    return null

  if (!oldEnd)
    return addHours(newBegin, 1)

  if (oldBegin) {
    const duration = differenceInMilliseconds(
      oldEnd,
      oldBegin,
    )
    return addMilliseconds(newBegin, duration)
  }
}

export function TaskForm({
  form,
  onSubmit,
}: TaskFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    trigger,
    setValue,
  } = form

  // trigger validation on every field change
  const watched = useWatch({ control })
  useEffect(() => {
    trigger()
  }, [trigger, watched])

  // BEGIN automatically set plannedEnd based on plannedBegin
  const plannedBegin = useWatch({ control, name: 'plannedBegin' })
  const plannedEnd = useWatch({ control, name: 'plannedEnd' })
  const oldPlannedBegin = usePrevious(plannedBegin)
  const oldPlannedEnd = usePrevious(plannedEnd)
  useEffect(() => {
    if (oldPlannedEnd !== plannedEnd) {
      // do nothing if both values are changed at once
      return
    }
    console.log('plannedBegin changed', plannedBegin)
    setValue('plannedEnd', getNewEnd(
      oldPlannedBegin,
      plannedEnd,
      plannedBegin,
    ))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plannedBegin])
  // END

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
