/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
import type { Subscription } from 'expo-sensors/build/Pedometer'

import * as Haptics from 'expo-haptics'
import { Accelerometer } from 'expo-sensors'
import { useEffect, useState } from 'react'

import { TimeDelta } from '~/lib/utils'

export function useShakedEffect(
  callback: () => void,
  {
    interval = 1000,
    threshold = 0.5,
    duration = TimeDelta.SECONDS(1),
    count = 2,
    once = true,
  },
) {
  const [lastTriggered, setLastTriggered] = useState(0)
  const [triggerCount, setTriggerCount] = useState(0)
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 1 })
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  function subscribe() {
    setSubscription(Accelerometer.addListener(setData))
  }

  function unsubscribe() {
    subscription?.remove()
    setSubscription(null)
  }

  function trigger() {
    const now = Date.now()

    if (lastTriggered + duration > now) {
      setTriggerCount(0)
    }

    setLastTriggered(now)
    setTriggerCount(prev => prev + 1)
  }

  useEffect(() => {
    subscribe()
    return () => unsubscribe()
  // intentionally run once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    Accelerometer.setUpdateInterval(interval)
  }, [interval])

  useEffect(() => {
    if (x > threshold || y > threshold || z < 1 - threshold) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      trigger()
    }
  // intentionally watch only x, y, z
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y, z])

  useEffect(() => {
    if (triggerCount >= count) {
      callback()
      setTriggerCount(0)
      if (once) {
        unsubscribe()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerCount])
}
