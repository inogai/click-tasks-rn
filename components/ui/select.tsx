import type { VariantProps } from 'class-variance-authority'
import type { ComponentRef } from 'react'

import { useControllableState } from '@rn-primitives/hooks'
import { FlashList } from '@shopify/flash-list'
import { cva } from 'class-variance-authority'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Button } from '~/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Pressable } from '~/components/ui/pressable'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { CheckIcon, ChevronsUpDownIcon } from '~/lib/icons'
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
  disabled?: boolean
  nativeID?: string
  placeholder?: string
  renderLabel?: (option: SelectOption) => React.ReactNode
}

export function Select({
  options,
  value: valueProp,
  onChange: onChangeProp,
  disabled = false,
  error = false,
  nativeID,
  placeholder,
  renderLabel = ({ label }) => <Text>{label}</Text>,
}: SelectProps & VariantProps<typeof selectTriggerVariants>) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    onChange: onChangeProp,
  })

  const [open, setOpen] = useState(false)

  const triggetRef = useRef<ComponentRef<typeof Button>>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    triggetRef.current?.measure((_x, _y, w) => {
      setWidth(w)
    })
  })

  const popoverTriggerRef = useRef<ComponentRef<typeof PopoverTrigger>>(null)

  useEffect(() => {
    if (open) {
      popoverTriggerRef.current?.open()
    }
    else {
      popoverTriggerRef.current?.close()
    }
  }, [open])

  return (
    <Popover onOpenChange={setOpen}>
      <PopoverTrigger ref={popoverTriggerRef} asChild>
        <Button
          accessible={true}
          className={cn(selectTriggerVariants({ error }))}
          disabled={disabled}
          nativeID={nativeID}
          ref={triggetRef}
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
          {value
            ? renderLabel(options.find(opt => opt.value === value)!)
            : <Text className="text-muted-foreground">{placeholder}</Text>}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border border-border p-0"
        style={{ width }}
      >
        <FlashList
          data={options}
          estimatedItemSize={56}
          extraData={[value]}
          ItemSeparatorComponent={() =>
            <Separator className="mx-2" />}
          renderItem={({ item }) => {
            const isSelected = value === item.value
            return (
              <Pressable
                className="flex-row items-center px-2 py-1.5"
                onPress={() => {
                  setValue(item.value)
                  setOpen(false)
                }}
                // accessibilityLabel={item.label}
                // accessibilityState={{
                //   selected: isSelected,
                // }}
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
