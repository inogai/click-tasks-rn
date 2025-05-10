import { createDrawerNavigator } from '@react-navigation/drawer'
import { router } from 'expo-router'
import React, { useMemo } from 'react'
import { View } from 'react-native'

import { Button } from '~/components/ui/button'

import { t } from '~/lib/i18n'
import { CirclePlusIcon, GroupIcon, UserRoundCogIcon } from '~/lib/icons'
import { TxnAccount, useRealmQuery } from '~/lib/realm'
import { R } from '~/lib/utils'

import TxnScreen from './[accountId]'

export default function AccountDrawerLayout() {
  const accounts = useRealmQuery(TxnAccount)

  // We intentionally used Drawer from '@react-navigation/drawer' instead of 'expo-router/drawer'
  // to dynamically generate the drawer items
  const Drawer = createDrawerNavigator()

  return (
    <Drawer.Navigator>
      {accounts.map((account) => {
        const id = account._id.toString()
        return (
          <Drawer.Screen
            component={TxnScreen}
            initialParams={{ accountId: id }}
            key={id}
            name={id}
            options={{
              title: account.name,
              headerShown: false,
            }}
          />
        )
      })}
    </Drawer.Navigator>
  )
}
