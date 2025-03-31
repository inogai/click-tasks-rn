import * as React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppHeader } from '~/components/AppHeader'

export default function Screen() {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex h-full flex-col items-stretch gap-5 bg-background">
        <AppHeader />
        <View className="grow">
        </View>
      </View>
    </SafeAreaView>
  )
}
