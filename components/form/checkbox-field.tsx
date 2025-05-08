import type { Control, FieldValues, Path } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'
import { Text, View } from 'react-native'

import { DateInput } from '~/components/date-input'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Pressable } from '~/components/ui/pressable'

interface CheckboxFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  className?: string
}

export function CheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  className,
}: CheckboxFieldProps<T>) {
  return (
    <View className={className}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <>
            <View
              className="flex-row items-center"
            >
              <Checkbox
                checked={value}
                className="mr-2"
                onCheckedChange={(e) => {
                  onChange(e)
                  onBlur()
                }}
                accessibilityLabelledBy={name}
              />
              <Label
                nativeID={name}
                onPress={() => {
                  onChange(!value)
                }}
              >
                {label}
              </Label>
            </View>

            {fieldState?.error && (
              <Text className="text-destructive">{fieldState.error?.message || ''}</Text>
            )}
          </>
        )}
      />
    </View>
  )
}
