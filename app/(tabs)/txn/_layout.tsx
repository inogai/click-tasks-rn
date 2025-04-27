import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { BookIcon, BookPlusIcon, CirclePlusIcon, WalletIcon } from '~/lib/icons'

export default function TxnLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerIcon: WalletIcon,
            title: 'Transactions Home',
          }}
        />

        <Drawer.Screen
          name="account-list"
          options={{
            drawerIcon: BookIcon,
            title: 'Accounts',
          }}
        />

        <Drawer.Screen
          name="create"
          options={{
            drawerIcon: CirclePlusIcon,
            title: 'Create Transaction',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
