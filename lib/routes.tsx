import type { RouteProp } from '@react-navigation/native'
import type { AnyZodObject } from 'zod'

import { useRoute as useNavRoute } from '@react-navigation/native'
import { z } from 'zod'

import { AppLogo } from '~/components/app-logo'

interface RouteDefinition {
  name: string
  label: string
  title?: string | (() => JSX.Element)
  props?: AnyZodObject
}

const _routes = [
  { name: 'index', label: 'Home', title: () => <AppLogo /> },
  { name: 'task/list', label: 'Tasks' },
  { name: 'task/create', label: 'Create Task' },
  { name: 'task/update', label: 'Update Task', props: z.object({ taskId: z.string() }) },
] as const satisfies RouteDefinition[]

type Routes = typeof _routes

// Export not as const to hide impl details
// and prevent error when accessing optional fields
export const routes = _routes as RouteDefinition[]

export type RouteNames = Routes[number]['name']

type RouteByName<TName extends RouteNames> = Extract<Routes[number], { name: TName }>

type ParamsList = {
  [TName in RouteNames]: RouteByName<TName> extends { props: infer P extends AnyZodObject }
    ? z.infer<P> | undefined
    : undefined
}

declare global {
  // eslint-disable-next-line ts/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends ParamsList {}
  }
}

export const useRoute = useNavRoute as <TName extends RouteNames>() => RouteProp<ParamsList, TName>
