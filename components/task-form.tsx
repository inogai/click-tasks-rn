import type { PopoverTrigger } from '~/components/ui/popover'
import type { ITaskRecord } from '~/lib/realm'
import type { ComponentRef } from 'react'
import type { Control, ControllerProps, ControllerRenderProps, FieldValues, Path, UseFormReturn } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { FlashList } from '@shopify/flash-list'
import { addHours, addMilliseconds, differenceInMilliseconds } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { FlatList, View } from 'react-native'

import { CheckboxField } from '~/components/form/checkbox-field'
import { FormField } from '~/components/form/form-field'
import { SelectField } from '~/components/form/select-field'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent } from '~/components/ui/popover'
import { Separator } from '~/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Text } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { CheckIcon, PlusIcon, XIcon } from '~/lib/icons'
import { TaskRecord, TaskStatus } from '~/lib/realm'
import { usePrevious } from '~/lib/use-previous'
import { cn, formatTimeDelta, TimeDelta } from '~/lib/utils'

type FormData = ITaskRecord

interface TaskFormProps {
  defaultValues?: Partial<FormData>
  onSubmit: (data: FormData) => void
  form: UseFormReturn<FormData>
}

export function useTaskForm() {
  return useForm<FormData>({
    resolver: zodResolver(TaskRecord.zodSchema),
    mode: 'onChange',
    defaultValues: {
      countdown: false,
      status: TaskStatus.PENDING,
      alarms: [],
    },
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
  onSubmit: onSubmitProp,
}: TaskFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
    setValue,
  } = form

  // BEGIN automatically set plannedEnd based on plannedBegin
  const plannedBegin = useWatch({ control, name: 'plannedBegin' })
  const plannedEnd = useWatch({ control, name: 'plannedEnd' })
  const oldPlannedBegin = usePrevious(plannedBegin)
  useEffect(() => {
    if (!isDirty || !oldPlannedBegin || !plannedBegin) {
      return
    }
    setValue('plannedEnd', getNewEnd(
      oldPlannedBegin,
      plannedEnd,
      plannedBegin,
    ))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plannedBegin])
  // END

  const tabOptions = [
    { value: 'task', label: t('task_form.tab.task') },
    { value: 'activity', label: t('task_form.tab.activity') },
  ]
  const [tab, setTab] = useState(form.getValues('plannedEnd')
    ? 'activity'
    : 'task',
  )

  function onSubmit(data: FormData) {
    if (tab === 'task') {
      data = { ...data, plannedEnd: null }
    }

    onSubmitProp(data)
  }

  return (
    <View className="gap-4">
      <Tabs
        value={tab}
        onValueChange={setTab}
      >
        <TabsList className="w-full flex-row">
          {tabOptions.map(({ label, value }) => (
            <TabsTrigger className="flex-1" key={value} value={value}>
              <Text>{label}</Text>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <FormField
        control={control}
        label={t('task_form.summary.label')}
        name="summary"
        placeholder="Enter task summary"
      />

      <FormField
        control={control}
        label={t('task_form.venue.label')}
        name="venue"
        placeholder="Enter venue (optional)"
      />

      <FormField
        control={control}
        name="plannedBegin"
        type="datetime"
        label={tab === 'task'
          ? t('task_form.due.label')
          : t('task_form.planned_begin.label')}
      />

      <FormField
        className={cn('visible', tab === 'task' && 'hidden')}
        control={control}
        label={t('task_form.planned_end.label')}
        name="plannedEnd"
        type="datetime"
      />

      <SelectField
        control={control}
        label={t('task_form.status.label')}
        name="status"
        options={[
          { label: t('task_form.status.values.pending'), value: TaskStatus.PENDING },
          { label: t('task_form.status.values.completed'), value: TaskStatus.COMPLETED },
          { label: t('task_form.status.values.overdue_completed'), value: TaskStatus.OVERDUE_COMPLETED },
          { label: t('task_form.status.values.deleted'), value: TaskStatus.DELETED },
        ]}
      />

      <CheckboxField
        control={control}
        label={t('task_form.countdown.label')}
        name="countdown"
      />

      <Controller
        control={control}
        name="alarms"
        render={({ field: { onChange, value }, fieldState }) => (
          <View>
            <Label className="text-sm font-medium">{t('task_form.alarms.label')}</Label>
            <AlarmInput setValues={onChange} values={value} />
            { fieldState.error && (<Text className="text-destructive">{fieldState.error.message}</Text>) }
          </View>
        )}
      />

      <Text className="text-destructive">
        { errors.root?.message }
      </Text>

      <Button
        className="flex-row gap-4"
        disabled={!isValid || isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        <CheckIcon className="text-primary-foreground" />
        <Text className="font-semibold text-primary-foreground">
          {t('button.submit')}
        </Text>
      </Button>

    </View>
  )
}

function AlarmInput({
  values,
  setValues,
}: {
  values: number[]
  setValues: (values: number[]) => void
}) {
  const popularTimedeltas = [
    TimeDelta.MINUTE(15),
    TimeDelta.MINUTE(30),
    TimeDelta.HOUR(1),
    TimeDelta.HOUR(1.5),
    TimeDelta.HOUR(2),
    TimeDelta.DAY(1),
  ]

  const [dialog, setDialog] = useState(false)
  const [custom, setCustom] = useState('')
  const [customError, setCustomError] = useState('')

  function submitCustom() {
    const newVal = Number.parseInt(custom, 10)
    if (Number.isNaN(newVal) || newVal < 0) {
      setCustomError(t('task_form.alarms.error.invalid'))
      return
    }
    if (values.includes(newVal)) {
      setCustomError(t('task_form.alarms.error.duplicated'))
      return
    }

    setValues([...values, newVal])
    setCustom('')
    setDialog(false)
    setCustomError('')
  }

  return (
    <View className="rounded-md border border-border">
      <FlatList
        data={values}
        renderItem={({ item, index }) => (
          <>
            <Button
              className="flex-row justify-start gap-4"
              variant="ghost"
              onPress={() => { setValues(values.filter((_, idx) => index !== idx)) }}
            >
              <XIcon />
              <Text>{formatTimeDelta(item)}</Text>
            </Button>
            <Separator orientation="horizontal" />
          </>
        )}
      />
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogTrigger asChild>
          <Button
            className="flex-row justify-start gap-4"
            variant="ghost"
          >
            <PlusIcon />
            <Text>{t('task_form.alarms.create')}</Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[800px] w-96">
          <DialogTitle>{t('task_form.alarms.create')}</DialogTitle>
          <FlashList
            data={popularTimedeltas}
            keyExtractor={item => item.toString()}
            renderItem={({ item: newVal }) => (
              newVal && (
                <>
                  <Button
                    className="flex-row justify-start gap-4"
                    key={newVal}
                    variant="ghost"
                    onPress={() => {
                      !values.includes(newVal) && setValues([...values, newVal])
                      setDialog(false)
                    }}
                  >
                    <Text>{formatTimeDelta(newVal)}</Text>
                  </Button>
                  <Separator orientation="horizontal" />
                </>
              )
            )}
          />
          <View
            className="flex-row items-center justify-start gap-4"
          >
            <Input
              className="!h-12 grow"
              keyboardType="numeric"
              placeholder={t('task_form.alarms.custom')}
              value={custom}
              onChangeText={setCustom}
              onKeyPress={e => e.nativeEvent.key === 'Enter' && submitCustom()}
            />
            <Text>{t('task_form.alarms.minutes')}</Text>
            <Button
              className="flex-row justify-start gap-4"
              onPress={submitCustom}
            >
              <CheckIcon />
            </Button>
          </View>
          <Text className="text-destructive">{customError}</Text>
        </DialogContent>
      </Dialog>

    </View>
  )
}
