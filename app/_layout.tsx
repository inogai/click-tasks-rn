import { PortalHost } from '@rn-primitives/portal'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { NestedProviders } from '~/components/layouts/nested-providers'
import { QueryClientProvider } from '~/components/providers/query-client-provider'
import { RealmProvider } from '~/components/providers/realm-provider'
import { ThemeProvider } from '~/components/providers/theme-provider'

import { useAppPreference } from '~/lib/preference'
import { useRealmSideEffects } from '~/lib/realm'
import { routes } from '~/lib/routes'
import { useColorScheme } from '~/lib/useColorScheme'

import '~/components/layouts/side-effects'
import '~/global.css'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

function Layout() {
  useRealmSideEffects()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        { routes.map(route => (
          <Stack.Screen
            key={route.name}
            name={route.name}
            options={{
              title: route.label,
              ...route.opts?.screenOptions,
            }}
          />
        ))}
      </Stack>
    </GestureHandlerRootView>
  )
}

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme()
  useAppPreference()

  return (
    <>
      <NestedProviders providers={[
        ThemeProvider,
        RealmProvider,
        QueryClientProvider,
      ]}
      >
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
        <Layout />
      </NestedProviders>

      <PortalHost />
    </>
  )
}
