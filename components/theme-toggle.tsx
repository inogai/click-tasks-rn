import { SunMoonIcon } from '~/lib/icons'
import { Pressable, View } from 'react-native'

import { MoonStar } from '~/lib/icons/MoonStar'
import { Sun } from '~/lib/icons/Sun'
import { preferenceSchema, usePreferenceStore } from '~/lib/preference'
import { cn } from '~/lib/utils'

const themes = preferenceSchema.shape.theme.options

export function ThemeToggle() {
  const [theme, setTheme] = usePreferenceStore(s => [s.theme, s.setTheme])

  const nextTheme = themes[themes.indexOf(theme) + 1] ?? themes[0]

  function toggleColorScheme() {
    setTheme(nextTheme)
  }

  return (
    <Pressable
      onPress={toggleColorScheme}
      className={`
        web:ring-offset-background web:transition-colors
        web:focus-visible:outline-none web:focus-visible:ring-2
        web:focus-visible:ring-ring web:focus-visible:ring-offset-2
      `}
    >
      {({ pressed }) => (
        <View
          className={cn(
            `
              aspect-square flex-1 items-start justify-center pt-0.5
              web:px-5
            `,
            pressed && 'opacity-70',
          )}
        >
          {nextTheme === 'dark' && (
            <MoonStar className="text-foreground" size={23} strokeWidth={1.25} />
          )}
          {nextTheme === 'light' && (
            <Sun className="text-foreground" size={24} strokeWidth={1.25} />
          )}
          {nextTheme === 'system' && (
            <SunMoonIcon className="text-foreground" size={23} strokeWidth={1.25} />)}
        </View>
      )}
    </Pressable>
  )
}
