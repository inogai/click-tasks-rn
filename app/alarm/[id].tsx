import { useRealm } from '@realm/react'
import { useInterval } from 'ahooks'
import { router, useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BSON } from 'realm'

import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { BellRingIcon } from '~/lib/icons'
import { Alarm, useRealmObject } from '~/lib/realm'
import { useShakedEffect } from '~/lib/use-shaked-effect'

export default function AlarmScreen() {
  const { id } = useLocalSearchParams<'/alarm/[id]'>()

  const realm = useRealm()
  const alarm = useRealmObject({
    type: Alarm,
    primaryKey: new BSON.ObjectId(id),
  })

  const shake = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: shake.value }] }
  })

  const triggerShake = () => {
    shake.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 100 }), 4, true),
      withTiming(0, { duration: 50 }),
    )
  }

  useInterval(() => triggerShake(), 1000)

  useShakedEffect(() => handleDismiss(), {})

  if (!alarm) {
    router.back()
    return <></>
  }

  function handleDismiss() {
    if (router.canGoBack()) {
      router.back()
    }
    else {
      router.replace('/(tabs)')
    }

    realm.write(() => {
      alarm?.delete(realm)
    })
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-evenly bg-black">
      <Text className="text-6xl font-semibold text-white">{alarm.title}</Text>

      <Animated.View style={animatedStyle}>
        <Button
          className="h-60 w-60 rounded-full"
          size="icon"
          variant="destructive"
          onPress={handleDismiss}
        >
          <View className={`
            h-56 w-56 items-center justify-center rounded-full border-4
            border-destructive-foreground bg-destructive-foreground/10 p-4
          `}
          >
            <BellRingIcon className="h-24 w-24 text-destructive-foreground" />
          </View>
        </Button>
      </Animated.View>

      <Text className="text-2xl font-semibold text-white">
        {t('alarm.shake_to_dismiss')}
      </Text>
    </SafeAreaView>
  )
}
