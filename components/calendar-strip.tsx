import type { Day } from 'date-fns'
import type { ViewStyle } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { addDays, addMonths, addWeeks, endOfWeek, formatDate, getWeekOfMonth, nextDay, startOfMonth, startOfWeek } from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-nativewind'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useDerivedValue, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated'
import { Button } from '~/components/ui/button'
import { cn, R } from '~/lib/utils'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_ITEM_HEIGHT = 56

interface DayItemProps {
  item: Date
  isSelected: boolean
  onPress: () => void
  className?: string
  style?: ViewStyle & { opacity?: number }
  hidden?: boolean
  dayIndex: number
}

const STAGGERING = 50
const duration = 300
const easing = Easing.bezier(0.25, 0.1, 0.25, 1)

function DayItem({
  item,
  isSelected,
  onPress,
  className,
  style,
  hidden = false,
  dayIndex,
}: DayItemProps) {
  const dayOfMonth = item.getDate()
  const dayOfWeek = item.getDay()
  const isSunday = dayOfWeek === 0

  const { opacity: normalOpacity = 1, ...restStyle } = style || {}

  // Create animated properties with initial values
  const opacity = useSharedValue(hidden ? 0 : normalOpacity)
  const height = useSharedValue(hidden ? 0 : DAY_ITEM_HEIGHT)
  const scale = useSharedValue(1)

  useEffect(() => {
    if (isSelected) {
      scale.value = withSequence(
        withTiming(1.2, { duration: 100, easing }),
        withTiming(1, { duration: 100, easing }),
      )
    }
  }, [isSelected])

  // Apply staggered animation effect based on dayIndex

  // Update animated values when props change
  useEffect(() => {
    const animationDelay = hidden
      ? (6 - dayIndex) * STAGGERING // Stagger effect
      : dayIndex * STAGGERING // Stagger effect

    opacity.value = withDelay(
      animationDelay,
      withTiming(hidden ? 0 : normalOpacity, { duration, easing }),
    )

    height.value = withDelay(
      animationDelay,
      withTiming(hidden ? 0 : DAY_ITEM_HEIGHT, { duration, easing }),
    )
  }, [hidden, isSelected, dayIndex, opacity, height])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    height: height.value,
    transform: [{ scale: scale.value }],
  }))

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[animatedStyle, restStyle]}
        className={cn(
          `flex flex-col items-center justify-center overflow-hidden`,
          isSelected && 'rounded-full bg-primary',
          className,
        )}
      >
        <Text className={cn(
          'text-sm font-semibold text-muted-foreground',
          isSelected && 'text-primary-foreground',
          isSunday && 'text-red-500',
        )}
        >
          {DAYS_OF_WEEK[dayOfWeek]}
        </Text>
        <Text className={cn(
          'text-foreground',
          isSelected && 'text-primary-foreground',
          isSunday && 'text-red-500',
        )}
        >
          {dayOfMonth}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

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

  function handleDayItemPress(date: Date) {
    onSelectedDateChange(date)
    setAnchorDate(date)
    setExpanded?.(false)
  }

  const renderDayItem = useCallback(({ item }: { item: Date[] }) => {
    return (
      <View className="h-96 w-16">
        {item.map((date, index) => {
          const key = formatDate(date, 'yyyy-MM-dd')
          const isSelected = selectedDateKey === key
          const shown = expanded || (date >= week && date <= endWeek)

          return (
            <DayItem
              dayIndex={index}
              key={key}
              style={{
                opacity: date.getMonth() === anchorDate.getMonth() ? 1 : 0.5,
              }}
              item={date}
              isSelected={isSelected}
              hidden={!shown}
              onPress={() => {
                handleDayItemPress(date)
              }}
            />
          )
        })}
      </View>
    )
  }, [anchorDate, expanded, onSelectedDateChange, selectedDateKey, weekOfMonth])

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
          {'W' + formatDate(anchorDate, 'w MMMM yyyy')}
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
