import type { SlottableTextProps, TextRef, ViewRef } from '@rn-primitives/types'
import type { ViewProps as RNViewProps } from 'react-native'

import * as Slot from '@rn-primitives/slot'
import * as React from 'react'
import { Text as RNText, View as RNView } from 'react-native'

import { cn } from '~/lib/utils'

const TextClassContext = React.createContext<string | undefined>(undefined)

interface ViewProps extends RNViewProps {
  textClass?: string
}

const View = React.forwardRef<ViewRef, ViewProps & { textClass?: string }>(
  ({ textClass, ...props }, ref) => {
    const parentTextClass = React.useContext(TextClassContext)
    return (
      <TextClassContext.Provider value={cn(parentTextClass, textClass)}>
        <RNView {...props} ref={ref} />
      </TextClassContext.Provider>
    )
  },
)

const Text = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext)
    const Component = asChild ? Slot.Text : RNText
    return (
      <Component
        className={cn(`
          text-base text-foreground
          web:select-text
        `, textClass, className)}
        ref={ref}
        {...props}
      />
    )
  },
)
Text.displayName = 'Text'

export type { ViewProps }

export { Text, TextClassContext, View }
