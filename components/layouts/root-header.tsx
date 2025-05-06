import * as React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AppLogo } from '~/components/app-logo'
import { ThemeToggle } from '~/components/theme-toggle'
import { Button } from '~/components/ui/button'

import { MenuIcon } from '~/lib/icons'

export function RootHeader() {
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className={`
        flex-row items-center justify-between border-b border-border p-4
      `}
    >
      <View className="flex-1 basis-0 flex-row justify-start gap-2">
        <Button
          size="icon"
          variant="ghost"
        >
          <MenuIcon />
        </Button>
      </View>

      <AppLogo />

      <View className="flex-1 basis-0 flex-row justify-end gap-2">
        <ThemeToggle />
      </View>
    </SafeAreaView>
  )
}
