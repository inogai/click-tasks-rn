import type { ViewRef } from '@rn-primitives/types'
import type {
  CellContext,
  ColumnDef,
  Row,
} from '@tanstack/react-table'
import type { ComponentProps } from 'react'

import { FlashList } from '@shopify/flash-list'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useCallback, useMemo, useRef } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Text } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { useMeasure } from '~/lib/use-mesaure'
import { cn, R } from '~/lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  columnWidths?: number[]
  columnWeights?: number[]
  estimatedRowSize?: number
  onRowPressed?: (row: TData) => void
}

function defaultRender({ getValue }: CellContext<any, any>) {
  return <Text>{getValue()}</Text>
}

export function DataTable<TData, TValue>({
  columns: columnsProp,
  data,
  columnWidths: baseWidths,
  columnWeights: weights,
  estimatedRowSize,
  onRowPressed,
}: DataTableProps<TData, TValue>) {
  const columns: ColumnDef<TData, TValue>[] = useMemo(() => R.map(columnsProp, it => ({
    cell: defaultRender,
    ...it,
    header: typeof it.header === 'string'
      ? <Text>{it.header}</Text>
      : it.header,
  } as ColumnDef<TData, TValue>)), [columnsProp])

  console.log(columns)

  baseWidths = baseWidths ?? R.range(0, columns.length).map(() => 0)
  weights = weights ?? R.range(0, columns.length).map(() => 0)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const tableRef = useRef<ViewRef | null>(null)
  const { width } = useMeasure(tableRef)

  const computedColumnWidths = useMemo(() => {
    const totalWidth = R.sum(baseWidths)
    const totalWeight = R.sum(weights)

    const remainingWidth = Math.max(0, width - totalWidth)
    const widthPerWeight = remainingWidth / totalWeight

    return R.range(0, columns.length).map((i) => {
      const weight = weights[i] ?? 0
      const baseWidth = baseWidths[i] ?? 0
      return baseWidth + weight * widthPerWeight
    },
    )
  }, [baseWidths, columns.length, weights, width])

  const getRowProps = useCallback((row: Row<TData>): Partial<ComponentProps<typeof TableRow>> => {
    if (!onRowPressed) {
      return {}
    }

    return {
      android_ripple: { color: '#888' },
      className: cn(
        `
          opacity-100 transition-opacity
          active:opacity-50
        `,
      ),
      onPress: () => { onRowPressed(row.original) },
    }
  }, [onRowPressed])

  return (
    <Table className="flex-1" ref={tableRef}>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} style={{ width: computedColumnWidths[header.index] }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length
          ? (
              <FlashList
                data={table.getRowModel().rows}
                estimatedItemSize={estimatedRowSize}
                extraData={[baseWidths, 5]}
                renderItem={({ item: row }) => (
                  <TableRow
                    key={row.id}
                    {...getRowProps(row)}
                  >
                    {row.getVisibleCells().map((cell, colIndex) => (
                      <TableCell key={cell.id} style={{ width: computedColumnWidths[colIndex] }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              />
            )
          : (
              <TableRow>
                <TableCell className="h-24 text-center">
                  <Text>{t('data_table.placeholder')}</Text>
                </TableCell>
              </TableRow>
            )}
      </TableBody>
    </Table>
  )
}
