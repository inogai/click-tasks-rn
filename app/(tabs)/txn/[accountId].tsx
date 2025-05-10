import type { DrawerScreenProps } from '@react-navigation/drawer'
import type { ColumnDef } from '@tanstack/react-table'
import type { TxnCat, TxnRecord } from '~/lib/realm'

import { createDrawerNavigator } from '@react-navigation/drawer'
import { Header } from '@react-navigation/elements'
import { useQuery } from '@realm/react'
import { formatDate } from 'date-fns'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BSON } from 'realm'

import { DataTable } from '~/components/data-table'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { CirclePlusIcon, GroupIcon, MenuIcon, UserRoundCogIcon } from '~/lib/icons'
import { TxnAccount, useRealmObject, useRealmQuery } from '~/lib/realm'
import { useArrayFrom } from '~/lib/use-array-from'
import { cn, R } from '~/lib/utils'

const columns: ColumnDef<TxnRecord>[] = [
  // { accessorKey: 'account.name', header: 'Account' },
  {
    accessorKey: 'cat',
    header: 'Cat.',
    cell: ({ getValue }) => {
      const category = getValue<TxnCat | undefined>()
      if (!category) { return null }

      return category?.renderIcon({ size: 20 })
    },
  },
  { accessorKey: 'summary', header: 'Summary' },
  {
    accessorKey: 'date',
    header: 'Txn Date',
    cell: ({ getValue }) =>
      formatDate(getValue<Date>(), 'yyyy-MM-dd'),
  },
  { accessorKey: 'amount', header: 'Amnt' },
]

export function TxnScreen({
  navigation: { toggleDrawer },
  route: { params },
}: DrawerScreenProps<any>) {
  const accountId = params?.accountId

  const account = useRealmObject(TxnAccount, new BSON.ObjectId(accountId))
  const txnRecords = useArrayFrom(account?.txns ?? [])
  const sum = useMemo(() => R.pipe(
    txnRecords,
    R.map(it => Number.parseFloat(it.amount.toString())),
    R.sum(),
  ), [txnRecords])

  return (
    <SafeAreaView
      className="flex-1"
      edges={['left', 'right']}
    >
      <Header
        title={account?.name ?? ''}
        headerLeft={() => (
          <View className="px-2">
            <Button
              size="icon"
              variant="ghost"
              onPress={toggleDrawer}
            >
              <MenuIcon />
            </Button>
          </View>
        )}
        headerRight={() => (
          <View className="mr-4 flex-row gap-2">
            <Button
              size="icon"
              variant="ghost"
              onPress={() => router.navigate('/txn-account/list')}
              accessibilityLabel={t('routes.txn-account.list')}
              accessibilityRole="link"
            >
              <UserRoundCogIcon />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onPress={() => router.navigate('/txn/create')}
              accessibilityLabel={t('routes.txn.create')}
              accessibilityRole="link"
            >
              <CirclePlusIcon />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onPress={() => router.navigate('/txn-cat/list')}
              accessibilityLabel={t('routes.txn-cat.list')}
              accessibilityRole="link"
            >
              <GroupIcon />
            </Button>
          </View>
        )}
        headerTitle={props => (
          <View>
            <Text className="text-xl font-medium">
              {props.children}
            </Text>
            <Text className={cn(
              'text-sm font-medium',
              sum > 0 ? 'text-green-500' : 'text-red-500',
            )}
            >
              {account?.currency ?? ''}
              {' '}
              {sum.toFixed(2)}
            </Text>
          </View>
        )}
      >
      </Header>

      <DataTable
        columns={columns}
        columnWeights={[0, 1, 0, 0]}
        columnWidths={[40, 10, 120, 60]}
        data={Array.from(txnRecords)}
        estimatedRowSize={106}
        onRowPressed={(row) => {
          router.push({
            pathname: '/txn/edit/[txnId]',
            params: {
              txnId: row._id.toString(),
            },
          })
        }}
      />
    </SafeAreaView>
  )
}

export default TxnScreen
