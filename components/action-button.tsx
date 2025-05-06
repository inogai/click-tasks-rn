import type { ButtonProps } from '~/components/ui/button'

import * as React from 'react'

import { Button } from '~/components/ui/button'

import { cn } from '~/lib/utils'

export type ActionButtonProps = ButtonProps

export const ActionButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  ActionButtonProps
>(({ className, size = 'icon', ...props }, ref) => {
  return (
    <Button
      {...props}
      ref={ref}
      size={size}
      className={cn(
        'absolute bottom-16 right-12 h-16 w-16 rounded-full bg-primary shadow',
        className,
      )}
    />
  )
})
