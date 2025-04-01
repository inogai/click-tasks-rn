import type { Day } from 'date-fns'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { addDays, formatDate, startOfWeek } from 'date-fns'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-nativewind'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Button } from '~/components/ui/button'
import { cn, R } from '~/lib/utils'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const INITIAL_SCROLL_INDEX = 7
const SCROLL_THRESHOLD_NUM = 1
const DAYS_TO_DISPLAY = 9 // -1 to 8

interface DaylistItem {
  date: Date
  dayOfMonth: number
  dayOfWeek: number
  key: string
}

interface DayItemProps {
  item: DaylistItem
  width: number
  isSelected: boolean
  onPress: () => void
}

function DayItem({ item, width, isSelected, onPress }: DayItemProps) {
  const isSunday = item.dayOfWeek === 0

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={cn(
          `flex h-full flex-col items-center justify-center`,
          isSelected && 'rounded-full bg-primary',
        )}
        style={{ width }}
      >
        <Text className={cn(
          'text-sm font-semibold text-muted-foreground',
          isSelected && 'text-primary-foreground',
          isSunday && 'text-red-500',
        )}
        >
          {DAYS_OF_WEEK[item.dayOfWeek]}
        </Text>
        <Text className={cn(
          'text-foreground',
          isSelected && 'text-primary-foreground',
          isSunday && 'text-red-500',
        )}
        >
          {item.dayOfMonth}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

function computeDaylist(anchorDate: Date): DaylistItem[] {
  return R.range(-1, 8).map((i) => {
    const date = addDays(anchorDate, i)
    const key = formatDate(date, 'yyyy-MM-dd')
    return {
      date,
      dayOfMonth: date.getDate(),
      dayOfWeek: date.getDay(),
      key,
    }
  })
}

export interface CalendarStripProps {
  selectedDate: Date
  onSelectedDateChange: (date: Date) => void
  expanded?: boolean // Made optional since it's unused
  weekStartsOn?: Day
  className?: string
}

export function CalendarStrip({
  selectedDate,
  onSelectedDateChange,
  weekStartsOn,
  className,
}: CalendarStripProps) {
  // State setup
  const [anchorDate, setAnchorDate] = useState(startOfWeek(selectedDate, { weekStartsOn }))
  const selectedDateKey = formatDate(selectedDate, 'yyyy-MM-dd')
  const [daylist, setDaylist] = useState(() => computeDaylist(anchorDate))
  const [width, setWidth] = useState(20)
  const [scrollIndicator, setScrollIndicator] = useState<null | 'left' | 'right'>(null)
  const [scrolling, setScrolling] = useState(false)

  // Refs
  const wrapperRef = useRef<View>(null)
  const listRef = useRef<FlashList<DaylistItem>>(null)

  // Navigation handlers
  const navigateWeek = useCallback((direction: 'left' | 'right') => {
    const daysToMove = direction === 'left' ? -7 : 7
    const newAnchorDate = addDays(anchorDate, daysToMove)
    setAnchorDate(newAnchorDate)
    setDaylist(computeDaylist(newAnchorDate))
  }, [anchorDate])

  const loadLeft = useCallback(() => navigateWeek('left'), [navigateWeek])
  const loadRight = useCallback(() => navigateWeek('right'), [navigateWeek])

  // Scroll handlers
  const handleScrollBegin = useCallback(() => {
    setScrolling(true)
  }, [])

  const handleScrollEnd = useCallback(() => {
    setScrolling(false)
    if (scrollIndicator === 'left') {
      loadLeft()
    }
    else if (scrollIndicator === 'right') {
      loadRight()
    }
    setScrollIndicator(null)
    listRef.current?.scrollToIndex({ index: 1, animated: true })
  }, [scrollIndicator, loadLeft, loadRight])

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!scrolling)
      return

    const offset = e.nativeEvent.contentOffset.x
    if (offset <= (INITIAL_SCROLL_INDEX - SCROLL_THRESHOLD_NUM) * width) {
      setScrollIndicator('left')
    }
    else if (offset >= (INITIAL_SCROLL_INDEX - SCROLL_THRESHOLD_NUM) * width) {
      setScrollIndicator('right')
    }
    else {
      setScrollIndicator(null)
    }
  }, [scrolling, width])

  // Calculate item width based on container width
  useLayoutEffect(() => {
    wrapperRef.current?.measure((_, __, w) => {
      setWidth(w / 7) // Divide by 7 for 7 days
    })
  }, [])

  const renderDayItem = useCallback(({ item }: { item: DaylistItem }) => {
    const isSelected = item.key === selectedDateKey
    return (
      <DayItem
        item={item}
        width={width}
        isSelected={isSelected}
        onPress={() => onSelectedDateChange(item.date)}
      />
    )
  }, [selectedDateKey, width, onSelectedDateChange])

  return (
    <View className={cn('flex flex-col items-stretch gap-2', className)}>
      {/* Header with month display and navigation buttons */}
      <View className="flex-row items-center justify-between px-2">
        <Button size="icon" variant="ghost" onPress={loadLeft}>
          <ChevronLeftIcon className="text-foreground" />
        </Button>
        <Text className="font-semibold text-muted-foreground">
          {formatDate(anchorDate, 'MMMM yyyy')}
        </Text>
        <Button size="icon" variant="ghost" onPress={loadRight}>
          <ChevronRightIcon className="text-foreground" />
        </Button>
      </View>

      {/* Calendar strip */}
      <View
        ref={wrapperRef}
        className={cn('relative h-16 w-full')}
      >
        {/* Scroll indicators */}
        <View className={`
          pointer-events-none absolute flex h-full w-full flex-row items-center
          justify-between
        `}
        >
          <ArrowLeftCircleIcon
            className={cn('text-blue-400', scrollIndicator !== 'left' && `
              opacity-0
            `)}
          />
          <ArrowRightCircleIcon
            className={cn('text-blue-400', scrollIndicator !== 'right' && `
              opacity-0
            `)}
          />
        </View>

        {/* Day list */}
        <FlashList
          ref={listRef}
          data={daylist}
          extraData={selectedDateKey}
          horizontal
          initialScrollIndex={INITIAL_SCROLL_INDEX}
          estimatedItemSize={width}
          keyExtractor={item => item.key}
          renderItem={renderDayItem}
          onScrollEndDrag={handleScrollEnd}
          onScrollBeginDrag={handleScrollBegin}
          onScroll={handleScroll}
        />
      </View>
    </View>
  )
}
