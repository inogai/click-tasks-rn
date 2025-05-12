import type { ViewRef } from '@rn-primitives/types'
import type { LucideIcon } from 'lucide-react-native'
import type { ViewProps } from 'react-native'

import * as React from 'react'

import { Pressable } from '~/components/ui/pressable'

import { cn } from '~/lib/utils'

interface CheckboxLikeOption {
  value: number
  rootClass?: string
  indicatorClass?: string
  icon: LucideIcon
  label?: string
}

interface CheckboxLikeProps extends ViewProps {
  options: CheckboxLikeOption[]
  value: number
  onPressed: (value: number) => void
}

export const CheckboxLike = React.forwardRef<ViewRef, CheckboxLikeProps>(
  ({ className, options, value, ...props }, ref) => {
    const selectedOption = options.find(option => option.value === value) ?? options[0]
    const IconComp = selectedOption?.icon

    return (
      <Pressable
        ref={ref}
        className={cn(
          `
            h-[20] w-[20] shrink-0 items-center justify-center rounded border
            border-primary bg-background
            disabled:opacity-50
          `,
          selectedOption?.rootClass,
          className,
        )}
        onPress={() => { props.onPressed(selectedOption.value) }}
        accessibilityLabel={selectedOption.label}
        {...props}
      >
        {IconComp && (
          <IconComp
            size={12}
            strokeWidth={3.5}
            width={12}
            className={cn(
              'text-primary-foreground',
              selectedOption?.indicatorClass,
            )}
          />
        )}
      </Pressable>
    )
  },
)
