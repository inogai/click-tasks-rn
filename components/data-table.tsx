import type { ViewRef } from '@rn-primitives/types'
import type {
  ColumnDef,
  Renderable,
  Row,
} from '@tanstack/react-table'
import type { ComponentProps } from 'react'

import { FlashList } from '@shopify/flash-list'
import {
  flexRender as webFlexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useCallback, useMemo, useRef } from 'react'
import { Platform, useWindowDimensions } from 'react-native'

import { Pressable } from '~/components/ui/pressable'
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

function flexRender<TProps extends object>(
  Comp: Renderable<TProps>,
  props: TProps,
): React.ReactNode | React.JSX.Element {
  const flexed = webFlexRender(Comp, props)

  return <Text>{flexed}</Text>
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  columnWidths?: number[]
  columnWeights?: number[]
  estimatedRowSize?: number
  onRowPressed?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  columnWidths: baseWidths,
  columnWeights: weights,
  estimatedRowSize,
  onRowPressed,
}: DataTableProps<TData, TValue>) {
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
