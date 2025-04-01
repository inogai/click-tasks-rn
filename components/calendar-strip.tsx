import type { Day } from 'date-fns'
import { FlashList } from '@shopify/flash-list'
import { addDays, addMonths, addWeeks, endOfWeek, formatDate, getWeekOfMonth, nextDay, startOfMonth, startOfWeek } from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-nativewind'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import { CalendarDay } from '~/components/calendar-day'
import { Collasper } from '~/components/collasper'
import { Button } from '~/components/ui/button'
import { cn, R } from '~/lib/utils'

const DAY_ITEM_HEIGHT = 56

const STAGGERING = 50
const easing = Easing.bezier(0.25, 0.1, 0.25, 1)

export interface CalendarStripProps {
  selectedDate: Date
  onSelectedDateChange: (date: Date) => void
  expanded?: boolean
  onExapndedChange?: (expanded: boolean) => void
  initialExpaned?: boolean
  weekStartsOn?: Day
  className?: string
}

function getWeekColumn(rawMonth: Date, dayOfWeek: Day, weekStartsOn?: Day) {
  const start = R.pipe(
    rawMonth,
    x => startOfMonth(x),
    x => startOfWeek(x, { weekStartsOn }),
    x => addDays(x, -1),
    x => nextDay(x, dayOfWeek),
  )

  // const end = R.pipe(
  //   rawMonth,
  //   x => endOfMonth(x),
  //   x => startOfWeek(x, { weekStartsOn }),
  //   x => addDays(x, -1),
  //   x => nextDay(x, dayOfWeek),
  // )

  return R.range(0, 6).map(weekNr => addWeeks(start, weekNr))
}

export function CalendarStrip({
  selectedDate,
  onSelectedDateChange,
  expanded,
  onExapndedChange: setExpanded,
  initialExpaned = false,
  weekStartsOn = 0,
  className,
}: CalendarStripProps) {
  // State setup
  const selectedDateKey = formatDate(selectedDate, 'yyyy-MM-dd')
  const [anchorDate, setAnchorDate] = useState(startOfWeek(selectedDate, { weekStartsOn }))

  const month = useMemo(() => startOfMonth(anchorDate), [anchorDate])
  const weekOfMonth = useMemo(() => getWeekOfMonth(anchorDate, { weekStartsOn }), [anchorDate, weekStartsOn])
  const week = useMemo(() => startOfWeek(anchorDate, { weekStartsOn }), [anchorDate, weekStartsOn])
  const endWeek = useMemo(() => endOfWeek(anchorDate, { weekStartsOn }), [anchorDate, weekStartsOn])

  const daylist = useMemo(() => R.pipe(
    R.range(0, 7),
    R.map(x => (x + weekStartsOn) % 7),
    R.map(dayOfWeek => getWeekColumn(month, dayOfWeek as Day, weekStartsOn)),
  ), [month, weekStartsOn])

  const [width, setWidth] = useState(20)

  const [controlledExpanded, setControlledExpanded] = useState(initialExpaned)

  if (expanded === undefined) {
    expanded = controlledExpanded
    setExpanded = setControlledExpanded
  }

  // Refs
  const wrapperRef = useRef<View>(null)
  const listRef = useRef<FlashList<Date[]>>(null)

  // Navigation handlers
  const navigateCalendar = useCallback((direction: 'left' | 'right') => {
    const moveDirection = direction === 'left' ? -1 : 1

    if (expanded) {
      setAnchorDate(addMonths(anchorDate, moveDirection))
    }
    else {
      setAnchorDate(addWeeks(anchorDate, moveDirection))
    }
  }, [anchorDate, expanded])

  const loadLeft = useCallback(() => navigateCalendar('left'), [navigateCalendar])
  const loadRight = useCallback(() => navigateCalendar('right'), [navigateCalendar])

  // Calculate item width based on container width
  useLayoutEffect(() => {
    wrapperRef.current?.measure((_, __, w) => {
      setWidth(w / 7) // Divide by 7 for 7 days
    })
  }, [])

  const handleDayItemPress = useCallback((date: Date) => {
    onSelectedDateChange(date)
    setAnchorDate(date)
    setExpanded?.(false)
  }, [onSelectedDateChange, setExpanded])

  const renderDayItem = useCallback(({ item }: { item: Date[] }) => {
    return (
      <View className="h-96 w-16">
        {item.map((date, index) => {
          const key = formatDate(date, 'yyyy-MM-dd')
          const isSelected = selectedDateKey === key
          const shown = expanded || (date >= week && date <= endWeek)

          return (
            <Collasper
              key={key}
              delay={STAGGERING * index}
              hidden={!shown}
              render={() => (
                <CalendarDay
                  date={date}
                  selected={isSelected}
                  onSelectedChange={value => value && handleDayItemPress(date)}
                  active={anchorDate.getMonth() === date.getMonth()}
                />
              )}
            />
          )
        })}
      </View>
    )
  }, [anchorDate, endWeek, expanded, handleDayItemPress, selectedDateKey, week])

  const height = useDerivedValue(
    () => withTiming(expanded ? DAY_ITEM_HEIGHT * 6 : DAY_ITEM_HEIGHT, { duration: STAGGERING * 6 + 300, easing }),
    [expanded],
  )

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }))

  return (
    <View className={cn('flex flex-col items-center gap-2', className)}>
      {/* Header with month display and navigation buttons */}
      <View className="w-full flex-row items-center justify-between px-2">
        <Button size="icon" variant="ghost" onPress={loadLeft}>
          <ChevronLeftIcon className="text-foreground" />
        </Button>
        <Text className="font-semibold text-muted-foreground">
          {`W${formatDate(anchorDate, 'w MMMM yyyy')}`}
        </Text>
        <Button size="icon" variant="ghost" onPress={loadRight}>
          <ChevronRightIcon className="text-foreground" />
        </Button>
      </View>

      {/* Calendar strip */}
      <Animated.View
        ref={wrapperRef}
        className={cn(`w-full flex-col items-center`)}
        style={animatedStyle}
      >
        {/* Day list */}
        <View>
          <FlashList
            ref={listRef}
            data={daylist}
            extraData={[selectedDateKey, expanded, weekOfMonth, anchorDate]}
            horizontal
            estimatedItemSize={width}
            renderItem={renderDayItem}
            scrollEnabled={false}
          />
        </View>
      </Animated.View>

      <TouchableOpacity
        className="-mb-4 h-4 w-32"
        onPress={() => { setExpanded?.(!expanded) }}
      >
        <View className="h-1 rounded-full bg-border" />
      </TouchableOpacity>
    </View>
  )
}
