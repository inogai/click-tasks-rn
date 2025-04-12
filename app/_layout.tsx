import { PortalHost } from '@rn-primitives/portal'
import { Drawer } from 'expo-router/drawer'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { AppHeader } from '~/components/app-header'
import { AppLogo } from '~/components/app-logo'
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

function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          header: props => <AppHeader {...props} />,
        }}
      >
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            headerTitle: () => <AppLogo />,
          }}
        />
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
