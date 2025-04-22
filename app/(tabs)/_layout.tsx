import { Tabs } from 'expo-router'

import { AppHeader } from '~/components/app-header'
import { AppTabBar } from '~/components/layouts/app-tab-bar'

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <AppTabBar {...props} />}
      screenOptions={{
        header: () => <AppHeader />,
        tabBarActiveTintColor: '#4A90E2',
      }}
    />
  )
}
