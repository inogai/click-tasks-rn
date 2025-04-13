import type { RouteProp } from '@react-navigation/native'
import type { AnyZodObject } from 'zod'

import { useRoute as useNavRoute } from '@react-navigation/native'
import { z } from 'zod'

import { AppLogo } from '~/components/app-logo'

import { t } from '~/lib/i18n'

interface RouteDefinition {
  name: string
  label: string
  title?: string | (() => JSX.Element)
  props?: AnyZodObject
}

/* eslint-disable style/no-multi-spaces, style/comma-spacing */
// @keep-aligned* ,
const _routes = [
  { name: 'index'      , label: t('routes.index')         , title: () => <AppLogo /> }               ,
  { name: 'task/list'  , label: t('routes.task.list') }   ,
  { name: 'task/create', label: t('routes.task.create') } ,
  { name: 'task/update', label: t('routes.task.update')   , props: z.object({ taskId: z.string() }) },
  { name: 'preference' , label: t('routes.preference') }  ,
] as const satisfies RouteDefinition[]
/* eslint-enable style/no-multi-spaces, style/comma-spacing */

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
