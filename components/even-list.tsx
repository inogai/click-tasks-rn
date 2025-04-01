import type { FlatListProps, LayoutChangeEvent, ListRenderItemInfo } from 'react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { FlatList } from 'react-native'

export interface EvenListRenderItemInfo<ItemT> extends ListRenderItemInfo<ItemT> {
  mainDim: number
}

export type EvenListRenderItem<ItemT> = (
  info: EvenListRenderItemInfo<ItemT>,
) => React.ReactElement | null

export type EventListProps<T> = Omit<FlatListProps<T>, 'renderItem'> & {
  data: T[]
  renderItem: EvenListRenderItem<T>
}

/**
 * EvenList component extends the standard FlatList with width measurement capabilities
 * @component
 */
export function EvenList<T>({
  renderItem,
  data,
  onLayout,
  ...props
}: EventListProps<T>) {
  const [mainDim, setMainDim] = useState<number>(0)
  const itemMainDim = useMemo(
    () => mainDim / (data.length ?? 1),
    [mainDim, data],
  )
  const listRef = useRef<FlatList<T>>(null)

  /**
   * Handler for layout changes to measure component width
   */
  const handleLayout = (event: LayoutChangeEvent) => {
    const newMainDim = props.horizontal
      ? event.nativeEvent.layout.width
      : event.nativeEvent.layout.height

    setMainDim(newMainDim)
    onLayout?.(event)
  }

  const handleRenderItem = useCallback((info: ListRenderItemInfo<T>) => {
    return renderItem({ ...info, mainDim: itemMainDim })
  }, [itemMainDim, renderItem])

  return (
    <FlatList
      ref={listRef}
      {...props}
      data={data}
      renderItem={handleRenderItem}
      onLayout={handleLayout}
    />
  )
}
