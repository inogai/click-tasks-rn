import type { SelectOption } from '~/components/ui/select'
import type { ITxnRecord } from '~/lib/realm'
import type { UseFormReturn } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@realm/react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Text, View } from 'react-native'

import { FormField } from '~/components/form/form-field'
import { MoneyField } from '~/components/form/money-field'
import { SelectField } from '~/components/form/select-field'
import { Button } from '~/components/ui/button'

import { t } from '~/lib/i18n'
import { CheckIcon } from '~/lib/icons'
import { TxnAccount, TxnRecord } from '~/lib/realm'
import { TimeDelta } from '~/lib/utils'

// Define the form data type based on the Transaction schema
type FormData = ITxnRecord

export interface TxnFormProps {
  onSubmit: (data: FormData) => void
  form: UseFormReturn<FormData>
}

export function useTxnForm() {
  const accounts = useQuery(TxnAccount)
  const schema = TxnRecord.zodSchema
    .refine(x => accounts.some(a => a._id.toString() === x.accountId), {
      message: t('txn_form.account.error'),
    })

  return useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })
}

export function TxnForm({
  form,
  onSubmit,
}: TxnFormProps) {
  const {
    control,
    handleSubmit,
    formState,
  } = form

  const { errors, isSubmitting, isValid } = formState

  const accounts = useQuery(TxnAccount)
  const accountOptions = useMemo(() => accounts.map((x): SelectOption => ({
    label: `${x.name} (${x.currency})`,
    value: x._id.toString(),
  })), [accounts])

  return (
    <View className="gap-4">
      <SelectField
        control={control}
        label={t('txn_form.account.label')}
        name="accountId"
        options={accountOptions}
      />

      <FormField
        control={control}
        label={t('txn_form.summary.label')}
        name="summary"
      />

      <MoneyField
        control={control}
        label={t('txn_form.amount.label')}
        name="amount"
      />

      <FormField
        control={control}
        label={t('txn_form.date.label')}
        name="date"
        type="datetime"
      />

      {/* TODO: Add category field once it's implemented in the schema */}

      <Text className="text-destructive">
        {errors.root?.message}
      </Text>

      <Button
        className="flex-row gap-4"
        disabled={!isValid || isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        <CheckIcon className="text-primary-foreground" />
        <Text className="text-primary-foreground">
          {t('button.submit')}
        </Text>
      </Button>
    </View>
  )
}
