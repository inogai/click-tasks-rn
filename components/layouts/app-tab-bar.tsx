import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'

import { PlatformPressable } from '@react-navigation/elements'
import { useLinkBuilder } from '@react-navigation/native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text, View } from '~/components/ui/text'
import { VoiceButton } from '~/components/voice-button'

import { t } from '~/lib/i18n'
import { SquareDashedIcon } from '~/lib/icons'
import { routes } from '~/lib/routes'
import { cn } from '~/lib/utils'

function TabBarItem({
  descriptors,
  state,
  navigation,
  name,
}: BottomTabBarProps & {
  name: string
}) {
  let index = state.routes.findIndex(r => r.name === name)
  if (index < 0) {
    index = 0
  }
  const route = state.routes[index]

  const { buildHref } = useLinkBuilder()
  const { options } = descriptors[route.key]

  const {
    icon: IconComp = SquareDashedIcon,
    label = 'unknown',
  } = routes
    .find(def => def.name === `/(tabs)/${route.name}`) ?? {}

  const isFocused = state.index === index

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    })

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params)
    }
  }

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    })
  }

  return (
    <PlatformPressable
      className="flex-1 items-center justify-center"
      href={buildHref(route.name, route.params)}
      key={route.key}
      testID={options.tabBarButtonTestID}
      onLongPress={onLongPress}
      onPress={onPress}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      accessibilityRole="tab"
      accessibilityState={isFocused ? { selected: true } : {}}
    >
      <View
        className={cn(
          `
            w-20 items-center rounded-2xl bg-background py-1 transition-[width]
            duration-200
          `,
          isFocused && 'w-16 bg-primary',
        )}
        textClass={cn(
          'text-foreground',
          isFocused && 'text-primary-foreground',
        )}
      >
        <IconComp key={`${route.key}#a`} size={20} />
      </View>
      <Text className="text-sm font-medium">{label}</Text>
    </PlatformPressable>
  )
}

function TabBarNotch() {
  // Set top to -1px to hide the border
  return (
    <>
      <View className={`
        pointer-events-none absolute inset-0 -top-px overflow-hidden
      `}
      >
        <View className="absolute -top-12 w-full items-center">
          <View className={`
            h-24 w-24 rounded-full border border-border bg-background
          `}
          />
        </View>
      </View>
    </>
  )
}

export function AppTabBar(props: BottomTabBarProps) {
  function handleVoiceAccept(message: string) {
    router.push({
      pathname: '/recognize/[text]',
      params: {
        text: message,
      },
    })
  }

  return (
    <SafeAreaView
      edges={['bottom']}
    >
      <View
        className="h-20 flex-row overflow-visible border-t border-border"
        accessibilityRole="tablist"
      >
        <TabBarNotch />
        <TabBarItem {...props} name="index" />
        <TabBarItem {...props} name="task" />
        <View className="w-20">
          <View className="absolute -top-10 w-full items-center">
            <VoiceButton
              containerClass="absolute w-20 h-20"
              iconClass="w-10 h-10"
              triggerClass="rounded-full"
              onAccept={handleVoiceAccept}
              aria-hidden={false}
              aria-label={t('voice_button.label')}
            />
          </View>
        </View>
        <TabBarItem {...props} name="txn" />
        <TabBarItem {...props} name="preference" />
      </View>
    </SafeAreaView>
  )
}
