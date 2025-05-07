import type { ITxnAccount } from '~/lib/realm'
import type { UseFormReturn } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { FormField } from '~/components/form/form-field'
import { Button } from '~/components/ui/button'
import { Text, View } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { CheckIcon } from '~/lib/icons'
import { usePreferenceStore } from '~/lib/preference'
import { TxnAccount } from '~/lib/realm'

type FormData = ITxnAccount

export function useTxnAccountForm() {
  const defaultCurrency = usePreferenceStore(store => store.preferedCurrency)

  return useForm<FormData>({
    resolver: zodResolver(TxnAccount.zodSchema),
    defaultValues: {
      currency: defaultCurrency,
    },
    mode: 'onChange',
  })
}

export interface TxnAccountFormProps {
  form: UseFormReturn<FormData>
  onSubmit: (data: FormData) => void
}

export function TxnAccountForm({
  form,
  onSubmit,
}: TxnAccountFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    trigger,
  } = form

  // trigger validation on every field change
  const watched = useWatch({ control })
  useEffect(() => {
    trigger()
  }, [trigger, watched])

  return (
    <View className="gap-y-4">
      <FormField
        control={control}
        label={t('txn_account_form.name.label')}
        name="name"
      />

      <FormField
        control={control}
        label={t('txn_account_form.currency.label')}
        name="currency"
      />

      <Text className="text-destructive">
        { errors.root?.message }
      </Text>

      <Button
        className="mt-4 flex-row gap-4"
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
