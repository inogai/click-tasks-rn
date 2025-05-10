import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'

import { TxnAccount, useRealmQuery } from '~/lib/realm'

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
