import type { ColumnDef } from '@tanstack/react-table'

import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { DataTable } from '~/components/data-table'

import { TxnAccount, useRealmQuery } from '~/lib/realm'

const columns: ColumnDef<TxnAccount>[] = [
  {
    id: 'index',
    accessorFn: (_, index) => index + 1,
    header: 'No.',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
  },
]

export default function AccountListScreen() {
  const accounts = useRealmQuery(TxnAccount)

  return (
    <SafeAreaView
      className="flex-1"
      edges={['left', 'right']}
    >
      <DataTable
        columns={columns}
        columnWeights={[0, 1, 1]}
        columnWidths={[60, 60, 60]}
        data={Array.from(accounts)}
        estimatedRowSize={75}
        onRowPressed={(row) => {
          router.push({
            pathname: '/txn/account-edit/[accountId]',
            params: {
              accountId: row._id.toString(),
            },
          })
        }}
      />
    </SafeAreaView>
  )
}
