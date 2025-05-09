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
            ({ size, color }: IconRenderProps) => <IconComp color={color} size={size} />
          )

          return (
            <DrawerItem
              icon={render}
              key={route.name}
              label={route.label}
              onPress={() => { navigation.navigate(route.name) }}
            />
          )
        })}
    </DrawerContentScrollView>
  )
}
