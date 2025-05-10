import type { DrawerScreenProps } from '@react-navigation/drawer'
import type { ColumnDef } from '@tanstack/react-table'
import type { TxnCat } from '~/lib/realm'

import { useQuery } from '@realm/react'
import { formatDate } from 'date-fns'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BSON } from 'realm'

import { DataTable } from '~/components/data-table'

import { TxnRecord } from '~/lib/realm'

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
  route: { params },
}: DrawerScreenProps<any>) {
  const accountId = params?.accountId
  const txnRecords = useQuery({
    type: TxnRecord,
    query: collection => collection
      .filtered('account._id == $0', new BSON.ObjectId(accountId)),
  })

  return (
    <SafeAreaView
      className="flex-1"
      edges={['left', 'right']}
    >
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
