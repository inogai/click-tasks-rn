import { Tabs } from 'expo-router'

import { AppTabBar } from '~/components/layouts/app-tab-bar'

import { routes } from '~/lib/routes'

const tabRoutes = routes
  .filter(route => route.name.startsWith('/(tabs)/'))
  .map(route => ({ ...route, name: route.name.replace('/(tabs)/', '') }))

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <AppTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: '#4A90E2',
      }}
    >
      {tabRoutes
        .map(route => (
          <Tabs.Screen
            name={route.name}
            key={route.name}
            options={{
              header: route.header,
            }}
          />
        ))}
    </Tabs>
  )
}
