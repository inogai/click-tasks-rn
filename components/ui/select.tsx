import type { VariantProps } from 'class-variance-authority'
import type { ComponentRef } from 'react'

import { useControllableState } from '@rn-primitives/hooks'
import { FlashList } from '@shopify/flash-list'
import { cva } from 'class-variance-authority'
import { useLayoutEffect, useRef, useState } from 'react'

import { Button } from '~/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Pressable } from '~/components/ui/pressable'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'

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
}

export function Select({
  options,
  value: valueProp,
  onChange: onChangeProp,
  disabled = false,
  error = false,
  nativeID,
  placeholder,
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

  return (
    <Popover onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-disabled={disabled}
          aria-expanded={open}
          className={cn(selectTriggerVariants({ error }))}
          disabled={disabled}
          nativeID={nativeID}
          ref={triggetRef}
          role="combobox"
          variant="outline"
        >
          {value
            ? <Text>{options.find(opt => opt.value === value)?.label}</Text>
            : <Text className="text-muted-foreground">{placeholder}</Text>}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border border-border p-0" style={{ width }}>
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
                aria-label={item.label}
                aria-selected={isSelected}
                className="flex-row items-center px-2 py-1.5"
                onPress={() => {
                  setValue(item.value)
                  setOpen(false)
                }}
                role="option"
              >
                <CheckIcon className={cn(
                  'mr-2 h-5 w-5 text-foreground',
                  isSelected ? 'opacity-100' : 'opacity-0',
                )}
                />
                <Text>{item.label}</Text>
              </Pressable>
            )
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
