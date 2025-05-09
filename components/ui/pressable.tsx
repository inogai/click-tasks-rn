import type { ComponentProps, ComponentRef } from 'react'

import { forwardRef } from 'react'
import { Platform, Pressable as RNPressable } from 'react-native'

import { cn } from '~/lib/utils'

const Pressable = forwardRef<
  ComponentRef<typeof RNPressable>,
  ComponentProps<typeof RNPressable>
>(
  ({ className, android_ripple, ...props }, ref) => {
    return (
      <RNPressable
        android_ripple={{ color: '#888', ...android_ripple }}
        ref={ref}
        className={cn(
          '',
          Platform.OS === 'ios' && `
            opacity-100 transition-opacity
            active:opacity-60
          `,
          className,
        )}
        {...props}
      />
    )
  },
)
Pressable.displayName = 'Pressable'

export { Pressable }
