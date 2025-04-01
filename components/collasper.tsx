import type { RefObject } from 'react'
import type { View } from 'react-native-reanimated/lib/typescript/Animated'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'

const duration = 300
const easing = Easing.bezier(0.25, 0.1, 0.25, 1)

export interface CollasperProps {
  delay: number
  render: ({ ref }: { ref: RefObject<View> }) => React.ReactNode
  hidden?: boolean
}

export function Collasper({
  delay,
  hidden = false,
  render,
}: CollasperProps) {
  const normalOpacity = 1
  const renderRef = useRef<View>(null)
  const [normalHeight, setNormalHeight] = useState(56)

  useLayoutEffect(() => {
    renderRef.current?.measure((_, __, ___, height) => {
      setNormalHeight(height)
    })
  })

  const opacity = useSharedValue(hidden ? 0 : normalOpacity)
  const height = useSharedValue(hidden ? 0 : normalHeight)
  const scale = useSharedValue(1)

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(hidden ? 0 : normalOpacity, { duration, easing }),
    )

    height.value = withDelay(
      delay,
      withTiming(hidden ? 0 : normalHeight, { duration, easing }),
    )
  }, [hidden, opacity, height, delay, normalHeight])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    height: height.value,
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View
      style={animatedStyle}
    >
      {render({ ref: renderRef })}
    </Animated.View>
  )
}
