import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import type { LucideIcon } from 'lucide-react-native'

import { router } from 'expo-router'

import { Button } from '~/components/ui/button'

import { t } from '~/lib/i18n'
import { HomeIcon, ListTodoIcon, PlusIcon, WalletIcon } from '~/lib/icons'

interface RouteDefinition {
  name: string
  label: string
  icon?: LucideIcon
  opts?: {
    screenOptions?: NativeStackNavigationOptions
    children?: RouteDefinition[]
    tabProps?: BottomTabNavigationOptions
  }
}

export const routes = [
  // use header in tabRoutes
  { name: '(tabs)', label: t('routes.(tabs).__itself__'), icon: HomeIcon, opts: { screenOptions: { headerShown: false } } },
  { name: 'task/update/[taskId]', label: t('routes.task.update'), icon: ListTodoIcon },
  { name: 'task/create', label: t('routes.task.create'), icon: ListTodoIcon },
  { name: 'txn/create', label: t('routes.txn.create'), icon: WalletIcon },
  { name: 'txn/edit/[txnId]', label: t('routes.txn.edit'), icon: WalletIcon },
  { name: 'txn-account/list', label: t('routes.txn-account.list'), opts: {
    screenOptions: {
      headerRight: () => (
        <Button
          className="mr-4"
          size="icon"
          variant="ghost"
          onPress={() => router.push('/txn-account/create')}
          accessibilityLabel={t('routes.txn-account.create')}
        >
          <PlusIcon />
        </Button>
      ),
    },
  } },
  { name: 'txn-account/create', label: t('routes.txn-account.create') },
  { name: 'txn-account/edit/[accountId]', label: t('routes.txn-account.edit') },
  { name: 'recognize/[text]', label: t('routes.recognize') },
  { name: 'prod-summary/monthly/[date]', label: t('routes.prod-summary.monthly') },
  { name: 'alarm/[id]', label: t('routes.alarm'), opts: { screenOptions: { headerShown: false } } },
] satisfies RouteDefinition[]
