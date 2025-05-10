import type { ComponentRef } from 'react'

import { FlashList } from '@shopify/flash-list'
import { useDebounce } from 'ahooks'
import { icons as lucideIcons } from 'lucide-react-native'
import React, { useMemo, useRef, useState } from 'react'
import { View } from 'react-native'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Pressable } from '~/components/ui/pressable'
import { Text, TextClassProvider } from '~/components/ui/text'

import { useColorScheme } from '~/lib/useColorScheme'
import { batched, cn, R } from '~/lib/utils'

const ICONS_PER_ROW = 5
const ROW_HEIGHT = 70
const ITEM_WIDTH = 70

export type IconName = keyof typeof lucideIcons

const iconNames = Object.keys(lucideIcons) as IconName[]

export function IconPicker({
  value,
  onChange,
}: {
  value: IconName
  onChange: (iconName: IconName) => void
}) {
  // Get all icon names from lucide-react-native

  const [search, setSearch] = useState('')
  const popoverTriggerRef = useRef<ComponentRef<typeof PopoverTrigger>>(null)

  const searchDebounced = useDebounce(search)

  const rows = useMemo(() => R.pipe(
    iconNames,
    R.filter(name => name.toLowerCase().includes(searchDebounced.toLowerCase())),
    R.take(5 * ICONS_PER_ROW),
    it => batched(it, ICONS_PER_ROW),
  ), [searchDebounced])

  const { isDarkColorScheme } = useColorScheme()

  function close() {
    popoverTriggerRef.current?.close()
  }

  // Render a single icon
  const renderIcon = ({ item }: { item: IconName }) => {
    const IconComponent = lucideIcons[item]
    const selected = item === value

    return (
      <Pressable
        style={{ height: ROW_HEIGHT, width: ITEM_WIDTH }}
        className={cn(
          'items-center justify-center rounded-xl bg-transparent p-2',
          selected && 'bg-primary',
        )}
        onPress={() => {
          onChange(item)
          close()
        }}
      >
        <TextClassProvider
          className={cn(
            'text-foreground',
            selected && 'text-primary-foreground',
          )}
        >
          <IconComponent color={isDarkColorScheme || selected ? '#fff' : '#000'} size={32} />
          <Text className="text-center text-xs font-medium">{item}</Text>
        </TextClassProvider>
      </Pressable>
    )
  }

  const renderRow = ({ item: row }: { item: IconName[] }) => {
    return (
      <View style={{ height: ROW_HEIGHT, width: ITEM_WIDTH * ICONS_PER_ROW }}>
        <FlashList
          data={row}
          estimatedItemSize={ITEM_WIDTH}
          horizontal
          renderItem={renderIcon}
        />
      </View>
    )
  }

  const IconComp = lucideIcons[value]

  return (
    <Popover>
      <PopoverTrigger ref={popoverTriggerRef} asChild>
        <Button variant="outline">
          <IconComp color="#000" size={32} />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{
        width: ITEM_WIDTH * ICONS_PER_ROW + 32,
        height: ROW_HEIGHT * 5,
      }}
      >
        <Input value={search} onChangeText={setSearch} />
        <FlashList
          data={rows}
          estimatedItemSize={ROW_HEIGHT}
          extraData={[value]}
          renderItem={renderRow}
        />
      </PopoverContent>
    </Popover>
  )
}
