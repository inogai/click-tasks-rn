import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { BookPlusIcon, PlusIcon, WalletIcon } from '~/lib/icons'

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
          name="account-create"
          options={{
            drawerIcon: BookPlusIcon,
            title: 'Create Account',
          }}
        />

        <Drawer.Screen
          name="account-list"
          options={{
            drawerIcon: BookPlusIcon,
            title: 'Accounts',
          }}
        />

        <Drawer.Screen
          name="create"
          options={{
            drawerIcon: PlusIcon,
            title: 'Create Transaction',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
