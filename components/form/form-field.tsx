import type { Control, FieldValues, Path } from 'react-hook-form'
import React from 'react'
import { Controller } from 'react-hook-form'
import { Text, View } from 'react-native'

import { DateInput } from '~/components/date-input'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

type FieldType = 'text' | 'datetime'

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  type?: FieldType
  className?: string
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  className,
}: FormFieldProps<T>) {
  return (
    <View className={className}>
      <Label nativeID={name}>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <>
            {type === 'text' && (
              <Input
                nativeID={name}
                placeholder={placeholder || label}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}

            {type === 'datetime' && (
              <DateInput
                nativeID={name}
                value={value}
                onValueChange={onChange}
                mode="datetime"
              />
            )}

            {fieldState?.error && (
              <Text className="text-destructive">{fieldState.error?.message || ''}</Text>
            )}
          </>
        )}
      />
    </View>
  )
}
