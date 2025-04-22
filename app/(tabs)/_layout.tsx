import { Tabs } from 'expo-router'
import { SquareDashedIcon } from '~/lib/icons'

import { AppHeader } from '~/components/app-header'

import { routes } from '~/lib/routes'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A90E2',
      }}
    >
      {routes.map((route) => {
        const IconComp = route.icon ?? SquareDashedIcon

        return (
          <Tabs.Screen
            key={route.name}
            name={route.name}
            options={{
              title: route.label,
              tabBarIcon: ({ color, size }) => <IconComp color={color} size={size} />,
              header: () => <AppHeader />,
            }}
          />
        )
      })}
    </Tabs>
  )
}
