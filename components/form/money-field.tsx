import type { Control, FieldValues, Path } from 'react-hook-form'

import * as SwitchPrimitives from '@rn-primitives/switch'
import { cva } from 'class-variance-authority'
import * as React from 'react'
import { Controller } from 'react-hook-form'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Text, TextClassProvider, View } from '~/components/ui/text'

import { MinusIcon, PlusIcon } from '~/lib/icons'
import { cn } from '~/lib/utils'

const cSwitchVariants = cva(
  `
    peer h-6 w-12 shrink-0 flex-row items-center rounded-full px-1
    transition-colors
  `,
  {
    variants: {
      checked: {
        true: 'bg-green-500/30',
        false: 'bg-red-500/30',
      },
      disabled: {
        true: 'opacity-50',
        false: 'opacity-100',
      },
    },
  },
)

const cSwitchThumbVariants = cva(
  `
    pointer-events-none flex h-5 w-5 items-center justify-center rounded-full
    transition-transform
  `,
  {
    variants: {
      checked: {
        true: 'translate-x-5 bg-green-500',
        false: 'translate-x-0 bg-red-500',
      },
    },
  },
)

const CustomSwitch = React.forwardRef<SwitchPrimitives.RootRef, SwitchPrimitives.RootProps>(
  ({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(cSwitchVariants(props))}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb asChild>
        <View
          className={cn(cSwitchThumbVariants(props))}
        >
          <TextClassProvider className="h-5 w-5 text-white">
            {props.checked ? <PlusIcon /> : <MinusIcon />}
          </TextClassProvider>
        </View>
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  ),
)

interface MoneyInputProps {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  placeholder?: string
  nativeID?: string
}

function MoneyInput({
  value,
  onChange,
  onBlur,
  placeholder = '0.00',
  nativeID,
}: MoneyInputProps) {
  const [positive, setPositive] = React.useState(true)
  const [input, setInput] = React.useState('')

  function handlePositiveChange(positive: boolean) {
    setPositive(positive)
    onChange(positive ? input : `-${input}`)
  }

  function handleInputChange(input: string) {
    setInput(input)
    onChange(positive ? input : `-${input}`)
  }

  React.useEffect(() => {
    if (!/^[+-]?\d+(?:\.\d{1,2})?$/.test(value)) {
      console.warn(`Invalid value: ${value}`)
      return
    }

    /* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
    setPositive(value[0] !== '-')
    setInput(value.replace(/^[+-]/, ''))
    /* eslint-enable react-hooks-extra/no-direct-set-state-in-use-effect */
  }, [value])

  return (
    <View
      className="flex-row items-center gap-2"
    >
      <CustomSwitch
        checked={positive}
        nativeID={nativeID}
        onCheckedChange={handlePositiveChange}
        accessibilityLabel="isPositive"
      />

      <Input
        className="flex-1"
        keyboardType="numeric"
        nativeID={nativeID}
        placeholder={placeholder}
        value={input}
        onBlur={onBlur}
        onChangeText={handleInputChange}
      />
    </View>
  )
}

interface MoneyFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  className?: string
}

export function MoneyField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
}: MoneyFieldProps<T>) {
  return (
    <View className={className}>
      <Label nativeID={name}>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <>
            <MoneyInput
              placeholder={placeholder}
              value={value}
              onBlur={onBlur}
              onChange={onChange}
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
