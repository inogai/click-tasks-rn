import { PortalHost } from '@rn-primitives/portal'
import { Drawer } from 'expo-router/drawer'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { AppHeader } from '~/components/app-header'
import { NestedProviders } from '~/components/layouts/nested-providers'
import { RealmProvider } from '~/components/providers/realm-provider'
import { ThemeProvider } from '~/components/providers/theme-provider'

import { routes } from '~/lib/routes'
import { useColorScheme } from '~/lib/useColorScheme'

import '~/components/layouts/side-effects'
import '~/global.css'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          header: props => <AppHeader {...props} />,
        }}
      >
        {routes.map(route => (
          <Drawer.Screen
            key={route.name}
            name={route.name}
            options={{
              drawerLabel: route.label,
              headerTitle: route.title,
            }}
          />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  )
}

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <NestedProviders providers={[ThemeProvider, RealmProvider]}>
      <>
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
        <Layout />
        <PortalHost />
      </>
    </NestedProviders>
  )
}
