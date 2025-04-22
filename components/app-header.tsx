import * as React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AppLogo } from '~/components/app-logo'
import { ThemeToggle } from '~/components/theme-toggle'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'

import { MenuIcon } from '~/lib/icons'

function render<Props>(obj: undefined | string | React.FC<Props>, props: Props) {
  if (obj === undefined) {
    return obj
  }

  if (typeof obj === 'string') {
    return <Text>{obj}</Text>
  }

  return obj(props)
}

export function AppHeader() {
  return (
    <SafeAreaView className={`
      h-28 w-full flex-row items-center justify-between border-b border-border
      p-4
    `}
    >
      <View className="flex-1 basis-0 items-start">
        <Button size="icon" variant="ghost">
          <MenuIcon />
        </Button>
      </View>

      <AppLogo className="-my-4" />

      <View className="flex-1 basis-0 items-end">
        <ThemeToggle />
      </View>
    </SafeAreaView>
  )
}
