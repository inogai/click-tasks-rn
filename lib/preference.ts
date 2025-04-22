import type { StateStorage } from 'zustand/middleware'

import { useColorScheme } from 'nativewind'
import { useEffect } from 'react'
import { MMKV } from 'react-native-mmkv'
import { z } from 'zod'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { setAndroidNavigationBar } from '~/lib/android-navigation-bar'
import { changeAppLanguage, languageSchema } from '~/lib/i18n'

export const preferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: languageSchema,
  speechLanguage: z.enum(['en-US', 'zh-CN', 'zh-HK']),
})

export type Preference = z.infer<typeof preferenceSchema>

const storage = new MMKV()

const mmkvStorage: StateStorage = {
  setItem: (name: string, value: string | number | boolean | ArrayBuffer) => {
    return storage.set(name, value)
  },
  getItem: (name: string) => {
    const value = storage.getString(name)
    return value ?? null
  },
  removeItem: (name: string) => {
    return storage.delete(name)
  },
}

export interface PreferenceStore extends Preference {
  setPreference: (newPreference: Preference) => void
  setTheme: (newTheme: Preference['theme']) => void
}

/**
 * A zustand store for user preferences.
 *
 * If you change the store structure, remember to update the `useAppPreference`
 * hook which reactively applies the preference.
 */
export const usePreferenceStore = create(
  persist<PreferenceStore>(
  // eslint-disable-next-line unused-imports/no-unused-vars
    (set, get) => ({
      theme: 'system',
      language: 'system',
      speechLanguage: 'en-US',
      setTheme: (newTheme: Preference['theme']) => {
        set(_ => ({ theme: newTheme }))
      },
      setPreference: (newPreference: Preference) => {
        set(_ => ({ ...newPreference }))
      },
    }),
    {
      name: 'preference',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
)

/**
 * A hook to apply the user preferences.
 *
 * Should only be called once near the root of the application.
 */
export function useAppPreference() {
  const { theme, language } = usePreferenceStore()

  const { colorScheme: realColorScheme, setColorScheme } = useColorScheme()

  useEffect(() => {
    setColorScheme(theme)
  }, [setColorScheme, theme])

  // `setAndroidNavigationBar` did not accept 'system' value
  // we have to hook into the real color scheme
  useEffect(() => {
    setAndroidNavigationBar(realColorScheme ?? 'dark')
  }, [realColorScheme])

  useEffect(() => {
    changeAppLanguage(language)
  }, [language])
}
