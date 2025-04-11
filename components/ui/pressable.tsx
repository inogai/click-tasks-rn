import type { ComponentProps, ComponentRef } from 'react'
import { forwardRef } from 'react'
import { Pressable as RNPressable } from 'react-native'

const Pressable = forwardRef<
  ComponentRef<typeof RNPressable>,
  ComponentProps<typeof RNPressable>
>(
  ({ className, android_ripple, ...props }, ref) => {
    return (
      <RNPressable
        android_ripple={{ color: '#888', ...android_ripple }}
        className={className}
        ref={ref}
        {...props}
      />
    )
  },
)
Pressable.displayName = 'Pressable'

export { Pressable }
