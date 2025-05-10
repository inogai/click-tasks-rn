import type { SelectOption } from '~/components/ui/select'
import type { ITxnRecord } from '~/lib/realm'
import type { LucideIcon } from 'lucide-react-native'
import type { UseFormReturn } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@realm/react'
import { icons as lucideIcons } from 'lucide-react-native'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Text, View } from 'react-native'

import { FormField } from '~/components/form/form-field'
import { MoneyField } from '~/components/form/money-field'
import { SelectField } from '~/components/form/select-field'
import { Button } from '~/components/ui/button'

import { t } from '~/lib/i18n'
import { CheckIcon } from '~/lib/icons'
import { TxnAccount, TxnCat, TxnRecord, useRealmQuery } from '~/lib/realm'
import { useArrayFrom } from '~/lib/use-array-from'
import { TimeDelta } from '~/lib/utils'

// Define the form data type based on the Transaction schema
type FormData = ITxnRecord

export interface TxnFormProps {
  onSubmit: (data: FormData) => void
  form: UseFormReturn<FormData>
  accounts: TxnAccount[]
  categories: TxnCat[]
}

export function useTxnForm() {
  const accounts = useArrayFrom(useRealmQuery(TxnAccount))
  const schema = TxnRecord.zodSchema
    .refine(x => accounts.some(a => a._id.toString() === x.accountId), {
      message: t('txn_form.account.error'),
    })

  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })
  const categories = useArrayFrom(useRealmQuery(TxnCat))

  return {
    form,
    accounts,
    categories,
  }
}

export function TxnForm({
  form,
  onSubmit,
  accounts,
  categories,
}: TxnFormProps) {
  const {
    control,
    handleSubmit,
    formState,
  } = form

  const { errors, isSubmitting, isValid } = formState

  const accountOptions = useMemo(() => accounts.map((x): SelectOption => ({
    label: `${x.name} (${x.currency})`,
    value: x._id.toString(),
  })), [accounts])

  console.log('categories', categories)
  const categoryOptions = useMemo(() => categories.map((x): SelectOption => ({
    label: x.name,
    value: x._id.toString(),
  })), [categories])
  const renderCategoryLabel = useCallback((option: SelectOption) => {
    const category = categories.find(x => x._id.toString() === option.value)

    return (
      <View className="flex-row items-center gap-4">
        {category?.renderIcon()}
        <Text className="font-medium">{category?.name}</Text>
      </View>
    )
  }, [categories])

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

      <SelectField
        control={control}
        label={t('txn_form.cat.label')}
        name="catId"
        options={categoryOptions}
        renderLabel={renderCategoryLabel}
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
