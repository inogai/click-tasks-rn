import type {
  DrawerContentComponentProps,
} from '@react-navigation/drawer'

import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer'

import { routes } from '~/lib/routes'

interface IconRenderProps {
  focused: boolean
  size: number
  color: string
}

export function AppSidebar(props: DrawerContentComponentProps) {
  const { navigation } = props

  return (
    <DrawerContentScrollView {...props}>
      {routes
        .filter(route => route.navigation !== 'hide')
        .map((route) => {
          const IconComp = route.icon
          const render = IconComp && (
            ({ size, color }: IconRenderProps) => <IconComp size={size} color={color} />
          )

          return (
            <DrawerItem
              key={route.name}
              label={route.label}
              icon={render}
              onPress={() => { navigation.navigate(route.name) }}
            />
          )
        })}
    </DrawerContentScrollView>
  )
}
