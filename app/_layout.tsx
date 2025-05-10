import { useRealm } from '@realm/react'
import { PortalHost } from '@rn-primitives/portal'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { NestedProviders } from '~/components/layouts/nested-providers'
import { QueryClientProvider } from '~/components/providers/query-client-provider'
import { RealmProvider } from '~/components/providers/realm-provider'
import { ThemeProvider } from '~/components/providers/theme-provider'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { PlusIcon } from '~/lib/icons'
import { useAppPreference } from '~/lib/preference'
import { TxnCat, useRealmSideEffects } from '~/lib/realm'
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
  const realm = useRealm()

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
        <Stack.Screen
          name="txn-cat/list"
          options={{
            title: t('routes.txn-cat.list'),
            headerRight: () => (
              <Button
                className="flex-row gap-2"
                size="icon"
                variant="ghost"
                onPress={() => {
                  realm.write(() => {
                    TxnCat.create({
                      name: t('txn_cat.new_cat.name'),
                      icon: 'SquareDashed',
                      color: '#4A90E2',
                    }, realm)
                  })
                }}
                accessibilityLabel={t('txn_cat.new_cat.label')}
              >
                <PlusIcon />
              </Button>
            ),
          }}
        />
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
