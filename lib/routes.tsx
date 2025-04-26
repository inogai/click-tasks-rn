import type { LucideProps } from 'lucide-react-native'

import { AppHeader } from '~/components/app-header'

import { t } from '~/lib/i18n'
import { HomeIcon, ListTodoIcon, SettingsIcon, SquareDashedIcon } from '~/lib/icons'

interface RouteDefinition {
  name: string
  label: string
  icon?: React.FC<LucideProps>
  header?: () => React.ReactNode
}

function createRoute(route: RouteDefinition): Required<RouteDefinition> {
  return {
    icon: SquareDashedIcon,
    header: AppHeader,
    ...route,
  }
}

/* eslint-disable style/no-multi-spaces, style/comma-spacing */
// @keep-aligned , }
const _routes = [
  { name: '/(tabs)/index'        , label: t('routes.index')        , icon: HomeIcon     },
  { name: '/(tabs)/task'         , label: t('routes.task')         , icon: ListTodoIcon },
  { name: '/(tabs)/preference'   , label: t('routes.preference')   , icon: SettingsIcon },
  { name: '/task/create'         , label: t('routes.task.create')                       },
  { name: '/task/update/[taskId]', label: t('routes.task.update')                       },
] satisfies RouteDefinition[]
/* eslint-enable style/comma-spacing */

export const routes = _routes.map(route => createRoute(route))
