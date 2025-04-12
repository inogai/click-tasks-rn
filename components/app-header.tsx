import type { DrawerHeaderProps } from '@react-navigation/drawer'
import { MenuIcon } from 'lucide-nativewind'
import * as React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ThemeToggle } from '~/components/theme-toggle'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'

function render<Props>(obj: undefined | string | React.FC<Props>, props: Props) {
  if (obj === undefined) {
    return obj
  }

  if (typeof obj === 'string') {
    return <Text>{obj}</Text>
  }

  return obj(props)
}

export function AppHeader({
  options,
  route,
  navigation,
}: DrawerHeaderProps) {
  const titleString = options?.title ?? route.name

  return (
    <SafeAreaView className={`
      flex h-28 flex-row items-center justify-between border-b border-border p-4
    `}
    >
      <View>
        <Button
          size="icon"
          variant="ghost"
          onPress={() => navigation.toggleDrawer()}
        >
          <MenuIcon className="text-foreground" />
        </Button>
      </View>

      {render(options?.headerTitle, {
        children: titleString,
      }) ?? <Text className="text-foreground">{titleString}</Text>}

      <View>
        <ThemeToggle />
      </View>
    </SafeAreaView>
  )
}
