import type { Preference } from '~/lib/preference'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon } from 'lucide-nativewind'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'

import { SelectField } from '~/components/form/select-field'
import { Button } from '~/components/ui/button'
import { Text, View } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { preferenceSchema, usePreferenceStore } from '~/lib/preference'

export function PreferenceScreen() {
  const { setPreference, ...preference } = usePreferenceStore()

  const {
    control,
    formState: { errors },
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
    <View className="gap-y-4 px-4 py-6">
      <SelectField
        control={control}
        name="theme"
        label={t('preference.theme.label')}
        options={[
          { label: t('preference.theme.values.light'), value: 'light' },
          { label: t('preference.theme.values.dark'), value: 'dark' },
          { label: t('preference.theme.values.system'), value: 'system' },
        ]}
      />

      <SelectField
        control={control}
        name="language"
        label={t('preference.language.label')}
        options={[
          { label: t('preference.language.values.en'), value: 'en' },
          { label: t('preference.language.values.zh-Hans'), value: 'zh-Hans' },
          { label: t('preference.language.values.zh-Hant'), value: 'zh-Hant' },
          { label: t('preference.language.values.system'), value: 'system' },
        ]}
      />

      <SelectField
        control={control}
        name="speechLanguage"
        label={t('preference.speech_language.label')}
        options={[
          { label: t('preference.speech_language.values.en-US'), value: 'en-US' },
          { label: t('preference.speech_language.values.zh-CN'), value: 'zh-CN' },
          { label: t('preference.speech_language.values.zh-HK'), value: 'zh-HK' },
        ]}
      />

      <Text className="text-destructive">
        { errors.root?.message }
      </Text>
    </View>
  )
}

export default PreferenceScreen
