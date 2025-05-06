import { Button } from '~/components/ui/button'

import { t } from '~/lib/i18n'
import { SunMoonIcon } from '~/lib/icons'
import { MoonStar } from '~/lib/icons/MoonStar'
import { Sun } from '~/lib/icons/Sun'
import { preferenceSchema, usePreferenceStore } from '~/lib/preference'

const themes = preferenceSchema.shape.theme.options
const labels = {
  dark: t('preference.theme.values.dark'),
  light: t('preference.theme.values.light'),
  system: t('preference.theme.values.system'),
}

export function ThemeToggle() {
  const [theme, setTheme] = usePreferenceStore(s => [s.theme, s.setTheme])

  const nextTheme = themes[themes.indexOf(theme) + 1] ?? themes[0]
  const label = labels[nextTheme]

  function toggleColorScheme() {
    setTheme(nextTheme)
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      onPress={toggleColorScheme}
      accessibilityLabel={label}
    >
      {nextTheme === 'dark' && (
        <MoonStar className="text-foreground" size={24} strokeWidth={1.25} />
      )}
      {nextTheme === 'light' && (
        <Sun className="text-foreground" size={24} strokeWidth={1.25} />
      )}
      {nextTheme === 'system' && (
        <SunMoonIcon className="text-foreground" size={24} strokeWidth={1.25} />)}
    </Button>
  )
}
