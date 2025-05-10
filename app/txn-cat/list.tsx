import type { Realm } from '@realm/react'
import type { ColumnDef } from '@tanstack/react-table'
import type { ITxnCat } from '~/lib/realm'

import { useRealm } from '@realm/react'
import { useCallback, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { DataTable } from '~/components/data-table'
import { IconPicker } from '~/components/form/icon-picker-field'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select } from '~/components/ui/select'
import { Text } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { PlusIcon, TrashIcon } from '~/lib/icons'
import { TxnCat, useRealmQuery } from '~/lib/realm'
import { useArrayFrom } from '~/lib/use-array-from'

function useColumns(realm: Realm): ColumnDef<TxnCat>[] {
  const updateCat = useCallback((cat: TxnCat, props: Partial<ITxnCat>) => {
    realm.write(() => { cat.update(props, realm) })
  }, [realm])

  return useMemo(() => [
    {
      accessorKey: 'icon',
      header: t('txn_cat.icon.label'),
      cell: ({ row }) => (
        <IconPicker
          value={row.getValue('icon')}
          onChange={(iconName) => { updateCat(row.original, { icon: iconName }) }}
        />
      ),
    },
    {
      accessorKey: 'name',
      header: t('txn_cat.name.label'),
      cell: ({ row }) => (
        <Input
          className="w-full"
          value={row.getValue('name')}
          onChangeText={name => updateCat(row.original, { name })}
        />
      ),
    },
    {
      accessorKey: 'color',
      header: t('txn_cat.color.label'),
      cell: ({ row }) => (
        <Select
          value={row.getValue('color')}
          options={[
          // TODO: provide a better palate / colorpicker
            { value: '#FF0000', label: 'Red' },
            { value: '#00FF00', label: 'Green' },
            { value: '#0000FF', label: 'Blue' },
          ]}
          // @ts-expect-error we know that it is a valid string
          onChange={color => updateCat(row.original, { color })}
        />
      ),
    },
    {
      id: 'delete',
      cell: ({ row }) => (
        <Button
          variant="destructive"
          accessibilityLabel={t('txn_cat.delete.label')}
        >
          <TrashIcon />
        </Button>
      ),
    },
  ], [updateCat])
}

export default function TxnCatListScreen() {
  const cats = useArrayFrom(useRealmQuery(TxnCat))
  const realm = useRealm()
  const columns = useColumns(realm)

  return (
    <SafeAreaView className="flex-1 px-2" edges={['left', 'right']}>
      <DataTable
        columns={columns}
        columnWeights={[0, 1, 0, 0]}
        columnWidths={[48, 120, 120, 48]}
        data={cats}
        estimatedRowSize={74}
      />
    </SafeAreaView>
  )
}
