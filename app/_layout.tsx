import { PortalHost } from '@rn-primitives/portal'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { NestedProviders } from '~/components/layouts/nested-providers'
import { RealmProvider } from '~/components/providers/realm-provider'
import { ThemeProvider } from '~/components/providers/theme-provider'
import { useColorScheme } from '~/lib/useColorScheme'

import '~/components/layouts/side-effects'
import '~/global.css'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <NestedProviders providers={[ThemeProvider, RealmProvider]}>
      <>
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              header: () => null,
            }}
          />
        </Stack>
        <PortalHost />
      </>
    </NestedProviders>
  )
}
