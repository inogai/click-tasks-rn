import type { VariantProps } from 'class-variance-authority'
import type { ComponentRef } from 'react'

import { useControllableState } from '@rn-primitives/hooks'
import { FlashList } from '@shopify/flash-list'
import { cva } from 'class-variance-authority'
import { useCallback, useRef, useState } from 'react'
import { FlatList, ScrollView, TouchableWithoutFeedback, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '~/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Pressable } from '~/components/ui/pressable'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { CheckIcon, ChevronsUpDownIcon } from '~/lib/icons'
import { useMeasure } from '~/lib/use-mesaure'
import { cn } from '~/lib/utils'

type SelectValue = string | number

export interface SelectOption {
  label: string
  value: SelectValue
  group?: string
  disabled?: boolean
}

const selectTriggerVariants = cva(
  'w-full flex-row justify-between',
  {
    variants: {
      error: {
        true: 'border-destructive text-destructive',
      },
    },
    defaultVariants: {
      error: false,
    },
  },
)

export interface SelectProps {
  options: SelectOption[]
  value: SelectValue | undefined
  onChange?: (value: SelectValue | undefined) => void
  onBlur?: () => void
  disabled?: boolean
  nativeID?: string
  placeholder?: string
  renderLabel?: (option: SelectOption) => React.ReactNode
}

function defaultRenderLabel({ label }: SelectOption) {
  return <Text>{label}</Text>
}

const ITEM_HEIGHT = 42

export function Select({
  options,
  value: valueProp,
  onChange: onChangeProp,
  onBlur,
  disabled = false,
  error = false,
  nativeID,
  placeholder,
  renderLabel = defaultRenderLabel,
}: SelectProps & VariantProps<typeof selectTriggerVariants>) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    onChange: onChangeProp,
  })

  const renderTriggerLabel = useCallback((value: SelectValue | undefined) => {
    const label = options.find(opt => opt.value === value)?.label

    if (label) {
      return renderLabel({ label, value: value! })
    }

    return <Text className="text-muted-foreground">{placeholder}</Text>
  }, [options, placeholder, renderLabel])

  const triggerRef = useRef<ComponentRef<typeof Button>>(null)
  const { width } = useMeasure(triggerRef, { width: 240 })

  const popoverTriggerRef = useRef<ComponentRef<typeof PopoverTrigger>>(null)

  const insets = useSafeAreaInsets()

  const [open, setOpen] = useState(false)

  function triggerOpen(val: boolean) {
    if (val) {
      popoverTriggerRef.current?.open()
    }
    else {
      popoverTriggerRef.current?.close()
    }
  }

  function handleOpenChange(val: boolean) {
    setOpen(val)
    if (val === false) {
      onBlur?.()
    }
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger ref={popoverTriggerRef} asChild>
        <Button
          accessible={true}
          className={cn(selectTriggerVariants({ error }))}
          disabled={disabled}
          nativeID={nativeID}
          ref={triggerRef}
          variant="outline"
          // TODO: blocked by react-native
          // https://github.com/facebook/react-native/issues/47268
          accessibilityActions={[
            { name: 'nextOption', label: t('select.nextOption') },
            { name: 'prevOption', label: t('select.prevOption') },
          ]}
          accessibilityRole="combobox"
          accessibilityState={{
            disabled,
            expanded: open,
          }}
          onAccessibilityAction={(event) => {
            console.log(event)
            switch (event.nativeEvent.actionName) {
              case 'nextOption': {
                const nextIndex = options.findIndex(opt => opt.value === value) + 1
                const nextOption = options[nextIndex % options.length]
                setValue(nextOption.value)
                break
              }
              case 'prevOption': {
                const prevIndex = options.findIndex(opt => opt.value === value) - 1
                const prevOption = options[(prevIndex + options.length) % options.length]
                setValue(prevOption.value)
                break
              }
              case 'activate': {
                setOpen(prev => !prev)
              }
            }
          }}
        >
          {renderTriggerLabel(value)}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        insets={insets}
        side="top"
        style={{ width, height: (ITEM_HEIGHT + 1) * options.length }}
      >
        <FlashList
          data={options}
          estimatedItemSize={ITEM_HEIGHT}
          extraData={[value]}
          ItemSeparatorComponent={() => <Separator />}
          renderItem={({ item }) => {
            const isSelected = value === item.value
            return (
              <Pressable
                className="flex-row items-center px-2"
                style={{ height: ITEM_HEIGHT }}
                onPress={() => {
                  setValue(item.value)
                  triggerOpen(false)
                }}
              >
                <CheckIcon className={cn(
                  'mr-2 h-5 w-5 text-foreground',
                  isSelected ? 'opacity-100' : 'opacity-0',
                )}
                />
                {renderLabel(item)}
              </Pressable>
            )
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
