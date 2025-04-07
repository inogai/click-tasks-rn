import type { Theme } from '@react-navigation/native'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NativeThemeProvider,
} from '@react-navigation/native'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'

import { setAndroidNavigationBar } from '~/lib/android-navigation-bar'
import { NAV_THEME } from '~/lib/constants'
import { useColorScheme } from '~/lib/useColorScheme'

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
}
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
}

const useIsomorphicLayoutEffect
  = Platform.OS === 'web' && typeof window === 'undefined' ? useEffect : useLayoutEffect

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const hasMounted = useRef(false)
  const { colorScheme, isDarkColorScheme } = useColorScheme()
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background')
    }
    setAndroidNavigationBar(colorScheme)
    setIsColorSchemeLoaded(true)
    hasMounted.current = true
  }, [])

  if (!isColorSchemeLoaded) {
    return null
  }

  return (
    <NativeThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      {children}
    </NativeThemeProvider>
  )
}
