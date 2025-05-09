import type { Preference } from '~/lib/preference'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { FormField } from '~/components/form/form-field'
import { SelectField } from '~/components/form/select-field'
import { Button } from '~/components/ui/button'
import { Text, View } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { CheckIcon } from '~/lib/icons'
import { preferenceSchema, usePreferenceStore } from '~/lib/preference'

export function PreferenceScreen() {
  const { setPreference, ...preference } = usePreferenceStore()

  const {
    control,
    formState: { errors },
  } = useForm<Preference>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: preference,
    mode: 'onChange',
  })

  return (
    <View className="gap-y-4 px-4 py-6">
      <SelectField
        control={control}
        label={t('preference.theme.label')}
        name="theme"
        options={[
          { label: t('preference.theme.values.light'), value: 'light' },
          { label: t('preference.theme.values.dark'), value: 'dark' },
          { label: t('preference.theme.values.system'), value: 'system' },
        ]}
      />

      <SelectField
        control={control}
        label={t('preference.language.label')}
        name="language"
        options={[
          { label: t('preference.language.values.en'), value: 'en' },
          { label: t('preference.language.values.zh-Hans'), value: 'zh-Hans' },
          { label: t('preference.language.values.zh-Hant'), value: 'zh-Hant' },
          { label: t('preference.language.values.system'), value: 'system' },
        ]}
        renderLabel={({ label, value }) => (
          <View className="flex-1 flex-row items-baseline">
            <Text>
              {label}
              {'  '}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {t(`preference.language.values.${value}`, { lng: value })}
            </Text>
          </View>
        )}
      />

      <SelectField
        control={control}
        label={t('preference.speech_language.label')}
        name="speechLanguage"
        options={[
          { label: t('preference.speech_language.values.en-US'), value: 'en-US' },
          { label: t('preference.speech_language.values.zh-CN'), value: 'zh-CN' },
          { label: t('preference.speech_language.values.zh-HK'), value: 'zh-HK' },
        ]}
      />

      <FormField
        control={control}
        label={t('preference.prefered_currency.label')}
        name="preferedCurrency"
        type="text"
      />

      <SelectField
        control={control}
        label={t('preference.alarm_type.label')}
        name="alarmType"
        options={[
          { label: t('preference.alarm_type.values.once'), value: 'once' },
          { label: t('preference.alarm_type.values.repeat'), value: 'repeat' },
        ]}
      />

      <Text className="text-destructive">
        { errors.root?.message }
      </Text>

      <Button className="flex-row gap-2">
        <CheckIcon />
        <Text>{t('button.submit')}</Text>
      </Button>
    </View>
  )
}

export default PreferenceScreen
