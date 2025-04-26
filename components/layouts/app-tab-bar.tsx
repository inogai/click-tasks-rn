import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import type { ReactNode } from 'react'

import { PlatformPressable } from '@react-navigation/elements'
import { useLinkBuilder } from '@react-navigation/native'
import { formatISO } from 'date-fns'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text, View } from '~/components/ui/text'
import { VoiceButton } from '~/components/voice-button'

import { SquareDashedIcon } from '~/lib/icons'
import { intentionRecognition } from '~/lib/intention-recognition'
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
      key={route.key}
      href={buildHref(route.name, route.params)}
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center"
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

function TabBarNotch({
  children,
}: {
  children: ReactNode
}) {
  // Set top to -1px to hide the border
  return (
    <>
      <View className={`
        pointer-events-none absolute inset-0 -top-px z-10 overflow-hidden
      `}
      >
        <View className="absolute -top-12 w-full items-center">
          <View className={`
            h-24 w-24 rounded-full border border-border bg-background
          `}
          />
        </View>
      </View>
      <View className="absolute -top-10 z-20 w-full items-center">
        {children}
      </View>
    </>
  )
}

function FunctionalVoiceButton() {
  const router = useRouter()

  async function handleVoiceAccept(message: string) {
    const results = await intentionRecognition(message)

    console.log('Intention recognition results', results)

    // TODO: we will have a dedicated UI to tell the user what items will be created
    // for now we just take the first 1 and send to task/create
    const task = results.tasks[0]

    router.navigate({
      pathname: '/task/create',
      params: {
        summary: task.summary,
        status: task.status,
        due: task.due && formatISO(task.due),
        venue: task.venue,
        plannedBegin: task.plannedBegin && formatISO(task.plannedBegin),
        plannedEnd: task.plannedEnd && formatISO(task.plannedEnd),
      },
    })
  }

  return (
    <VoiceButton
      containerClass="absolute w-20 h-20"
      triggerClass="rounded-full"
      iconClass="w-10 h-10"
      onAccept={handleVoiceAccept}
    />
  )
}

export function AppTabBar(props: BottomTabBarProps) {
  return (
    <SafeAreaView
      edges={['bottom']}
    >
      <View className="h-20 flex-row border-t border-border">
        <TabBarNotch>
          <FunctionalVoiceButton />
        </TabBarNotch>

        <TabBarItem {...props} name="index" />
        <TabBarItem {...props} name="task" />
        <View className="w-20" />
        <TabBarItem {...props} name="txn" />
        <TabBarItem {...props} name="preference" />
      </View>
    </SafeAreaView>
  )
}
