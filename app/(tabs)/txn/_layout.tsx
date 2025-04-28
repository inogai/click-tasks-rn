import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { BookIcon, CirclePlusIcon, WalletIcon } from '~/lib/icons'

export default function TxnLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerIcon: ({ color, size }) =>
              <WalletIcon color={color} size={size} />,
            title: 'Transactions Home',
          }}
        />

        <Drawer.Screen
          name="account-list"
          options={{
            drawerIcon: ({ color, size }) =>
              <BookIcon color={color} size={size} />,
            title: 'Accounts',
          }}
        />

        <Drawer.Screen
          name="create"
          options={{
            drawerIcon: ({ color, size }) =>
              <CirclePlusIcon color={color} size={size} />,
            title: 'Create Transaction',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
