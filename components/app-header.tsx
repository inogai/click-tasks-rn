import { MenuIcon } from 'lucide-nativewind'
import * as React from 'react'
import { Text, View } from 'react-native'
import { ThemeToggle } from '~/components/theme-toggle'
import { Button } from '~/components/ui/button'

function AppLogo() {
  return (
    <Text className="text-3xl font-extrabold text-[#75ca00]">
      Better
    </Text>
  )
}

export function AppHeader() {
  return (
    <View className="flex flex-row items-center justify-between border-border border-b p-4">
      <View>
        <Button size="icon" variant="ghost">
          <MenuIcon className="text-foreground" />
        </Button>
      </View>

      <AppLogo />

      <View>
        <ThemeToggle />
      </View>
    </View>
  )
}
