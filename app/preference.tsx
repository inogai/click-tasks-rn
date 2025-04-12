import type { Preference } from '~/lib/preference'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon } from 'lucide-nativewind'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'

import { SelectField } from '~/components/form/select-field'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'

import { preferenceSchema, usePreferenceStore } from '~/lib/preference'

export function PreferenceScreen() {
  const { setPreference, ...preference } = usePreferenceStore()

  function onSubmit(data: Preference) {
    setPreference(data)
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    trigger,
  } = useForm<Preference>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: preference,
  })

  const formValues = useWatch({ control })
  useEffect(() => {
    // trigger validation on every field change
    trigger()
    // update preference store when watched changes
    const { data, success } = preferenceSchema.safeParse(formValues)
    if (success) {
      setPreference(data)
    }
  }, [formValues, setPreference, trigger])

  return (
    <SafeAreaView>
      <SelectField
        control={control}
        name="theme"
        label="Theme"
        options={[
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
          { label: 'Follow System', value: 'system' },
        ]}
        className="mb-4"
      />

      <SelectField
        control={control}
        name="language"
        label="Language"
        options={[
          { label: 'English (US)', value: 'en' },
          { label: '中文 (简体)', value: 'zh' },
          { label: '中文 (繁體)', value: 'zh-Hant' },
          { label: 'Follow System', value: 'system' },
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
    </SafeAreaView>
  )
}

export default PreferenceScreen
