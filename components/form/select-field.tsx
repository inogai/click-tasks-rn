import type { SelectOption } from '~/components/ui/select'
import type { Control, FieldValues, Path } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'
import { Text, View } from 'react-native'

import { Label } from '~/components/ui/label'
import { Select } from '~/components/ui/select'

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  className?: string
  options: SelectOption[]
  renderLabel?: (option: SelectOption) => React.ReactNode
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  options,
  renderLabel,
}: SelectFieldProps<T>) {
  return (
    <View className={className}>
      <Label nativeID={name}>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <>
            <Select
              options={options}
              placeholder={placeholder || label}
              value={value}
              onChange={onChange}
              renderLabel={renderLabel}
            />

            {fieldState?.error && (
              <Text className="text-destructive">{fieldState.error?.message || ''}</Text>
            )}
          </>
        )}
      />
    </View>
  )
}
