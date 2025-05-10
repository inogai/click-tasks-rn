import { formatDate } from 'date-fns'
import { router, Tabs } from 'expo-router'
import { View } from 'react-native'

import { AppTabBar } from '~/components/layouts/app-tab-bar'
import { Button } from '~/components/ui/button'

import { t } from '~/lib/i18n'
import {
  CirclePlusIcon,
  HomeIcon,
  ListTodoIcon,
  PlusIcon,
  SettingsIcon,
  UserRoundCogIcon,
  WalletIcon,
} from '~/lib/icons'

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <AppTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('routes.(tabs).index'),
          tabBarIcon: props => <HomeIcon {...props} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: t('routes.(tabs).task'),
          tabBarIcon: props => <ListTodoIcon {...props} />,
          headerRight: () => (
            <Button
              className="mr-4"
              size="icon"
              variant="ghost"
              onPress={() => router.navigate('/task/create')}
              accessibilityLabel={t('routes.task.create')}
            >
              <PlusIcon />
            </Button>
          ),
        }}
      />
      <Tabs.Screen
        name="txn"
        options={{
          title: t('routes.(tabs).txn'),
          tabBarIcon: props => <WalletIcon {...props} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="preference"
        options={{
          title: t('routes.(tabs).preference'),
          tabBarIcon: props => <SettingsIcon {...props} />,
        }}
      />
    </Tabs>
  )
}
