import type { SelectOption } from '~/components/ui/select'
import type { ITxnRecord } from '~/lib/realm'
import type { UseFormReturn } from 'react-hook-form'

import { useQuery } from '@realm/react'
import { useMemo } from 'react'
import { Text, View } from 'react-native'

import { FormField } from '~/components/form/form-field'
import { SelectField } from '~/components/form/select-field'
import { Button } from '~/components/ui/button'

import { t } from '~/lib/i18n'
import { CheckIcon } from '~/lib/icons'
import { TxnAccount } from '~/lib/realm'

// Define the form data type based on the Transaction schema
type FormData = ITxnRecord

export interface TxnFormProps {
  onSubmit: (data: FormData) => void
  form: UseFormReturn<FormData>
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

      {/* TODO: add a easy switch for +/- value */}
      <FormField
        control={control}
        label={t('txn_form.amount.label')}
        name="amount"
        type="numeric"
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
