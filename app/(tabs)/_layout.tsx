import { Tabs } from 'expo-router'

import { AppTabBar } from '~/components/layouts/app-tab-bar'

import { routes } from '~/lib/routes'

const tabRoutes = routes
  .filter(route => route.name.startsWith('/(tabs)/'))
  .map(route => ({ ...route, name: route.name.replace('/(tabs)/', '') }))

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A90E2',
      }}
      tabBar={props => <AppTabBar {...props} />}
    >
      {tabRoutes
        .map((route) => {
          const headerOpts = route.header === 'hidden'
            ? { headerShown: false }
            : { header: route.header }

          return (
            <Tabs.Screen
              key={route.name}
              name={route.name}
              options={{
                ...headerOpts,
              }}
            />
          )
        })}
    </Tabs>
  )
}
