import type { SlottableTextProps, TextRef, ViewRef } from '@rn-primitives/types'
import type { ViewProps as RNViewProps } from 'react-native'

import * as Slot from '@rn-primitives/slot'
import * as React from 'react'
import { Text as RNText, View as RNView } from 'react-native'

import { cn } from '~/lib/utils'

const TextClassContext = React.createContext<string | undefined>(undefined)

export function TextClassProvider({ className, children }: { className: string, children: React.ReactNode }) {
  return (
    <TextClassContext.Provider value={className}>
      {children}
    </TextClassContext.Provider>
  )
}

interface ViewProps extends RNViewProps {
  textClass?: string
}

const View = RNView

const Text = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext)
    const Component = asChild ? Slot.Text : RNText
    return (
      <Component
        ref={ref}
        className={cn(`
          text-base text-foreground
          web:select-text
        `, textClass, className)}
        {...props}
      />
    )
  },
)
Text.displayName = 'Text'

export type { ViewProps }

export { Text, TextClassContext, View }
