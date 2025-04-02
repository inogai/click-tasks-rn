import type { Day } from 'date-fns'
import { addDays, addMonths, addWeeks, differenceInDays, formatDate, getWeek, getWeekOfMonth, startOfMonth, startOfWeek } from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-nativewind'
import { useCallback, useMemo, useRef, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import { CalendarDay } from '~/components/calendar-day'
import { Collasper } from '~/components/collasper'
import { EvenList } from '~/components/even-list'
import { Button } from '~/components/ui/button'
import { t } from '~/lib/i18n'
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

/**
 * Generates an array of 7 Date objects representing a complete week
 *
 * This function calculates all 7 days of a week starting from a specified
 * day of the week (weekStartsOn). It uses the provided date to determine
 * the reference week and adjusts the starting day according to weekStartsOn.
 *
 * @param week - Any date within the desired week
 * @param weekStartsOn - Day enum (0-6) representing which day the week starts on
 *                       (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * @returns An array of 7 dates representing the days of the week
 */
function getWeekDays(week: Date, weekStartsOn: Day) {
  // A 7-day week starting from the given dayOfWeek
  const weekStart = startOfWeek(week, { weekStartsOn })
  const dayIndices = R.range(0, 7).map(x => (x + weekStartsOn) % 7)

  return dayIndices.map(dayIndex => addDays(weekStart, dayIndex))
}

/**
 * Generates a 6-week calendar grid for a given month
 *
 * This function creates a calendar grid containing 6 rows (weeks) with 7 days each,
 * starting from the week that contains the first day of the specified month.
 * The calendar can be adjusted to start on any day of the week.
 *
 * @param monthDate - Any date within the desired month
 * @param weekStartsOn - Day enum (0-6) representing which day the week starts on
 *                       (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * @returns A 2D array of Date objects, where each inner array represents a week (7 days)
 */
function getWeekRows(monthDate: Date, weekStartsOn: Day = 0) {
  const firstDayOfMonth = startOfMonth(monthDate)
  const firstDayOfCalendar = startOfWeek(firstDayOfMonth, { weekStartsOn })

  const dayFromPreviousMonth = differenceInDays(firstDayOfMonth, firstDayOfCalendar)

  // if firstDayOfMonth is the left most day
  // move it down to the next week
  const weekOffsets = dayFromPreviousMonth !== 0
    ? R.range(0, 6)
    : R.range(-1, 5)

  // Generate a day for each week (6 weeks)
  const weeks = weekOffsets.map(offset => addWeeks(firstDayOfCalendar, offset))

  // Map the weeks to their respective days
  return weeks.map(week => getWeekDays(week, weekStartsOn))
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
  const [anchorDate, setAnchorDate] = useState(selectedDate)

  const month = useMemo(() => startOfMonth(anchorDate), [anchorDate])
  const weekOfMonth = useMemo(() => getWeekOfMonth(anchorDate, { weekStartsOn }), [anchorDate, weekStartsOn])
  const currentWeekStart = useMemo(() => startOfWeek(anchorDate, { weekStartsOn }), [anchorDate, weekStartsOn])

  const weeks = useMemo(() =>
    getWeekRows(month, weekStartsOn), [month, weekStartsOn])

  const [controlledExpanded, setControlledExpanded] = useState(initialExpaned)

  if (expanded === undefined) {
    expanded = controlledExpanded
    setExpanded = setControlledExpanded
  }

  // Refs
  const wrapperRef = useRef<View>(null)

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

  const handleDayItemPress = useCallback((date: Date) => {
    onSelectedDateChange(date)
    setAnchorDate(date)
    setExpanded?.(false)
  }, [onSelectedDateChange, setExpanded])

  const renderWeekRow = useCallback(({ item, index }: { item: Date[], index: number }) => {
    const weekStartDate = item[0]
    const isCurrentWeek
      = !expanded
        && weekStartDate.getTime() <= currentWeekStart.getTime()
        && addDays(weekStartDate, 6).getTime() >= currentWeekStart.getTime()

    const shown = expanded || isCurrentWeek

    return (
      <Collasper
        key={`week-${index}`}
        delay={STAGGERING * index}
        hidden={!shown}
        render={() => (
          <View className="w-full px-2">
            <EvenList
              data={item}
              horizontal
              renderItem={({ item: date, mainDim: width }) => {
                const key = formatDate(date, 'yyyy-MM-dd')
                const isSelected = selectedDateKey === key

                return (
                  <CalendarDay
                    style={{ width }}
                    className="h-full"
                    date={date}
                    selected={isSelected}
                    onSelectedChange={value => value && handleDayItemPress(date)}
                    active={anchorDate.getMonth() === date.getMonth()}
                  />
                )
              }}
            />
          </View>
        )}
      />
    )
  }, [anchorDate, currentWeekStart, expanded, handleDayItemPress, selectedDateKey])

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
          {t('intl_calendar_strip_title', {
            val: anchorDate,
            week: getWeek(anchorDate)
          })}
        </Text>
        <Button size="icon" variant="ghost" onPress={loadRight}>
          <ChevronRightIcon className="text-foreground" />
        </Button>
      </View>

      {/* Calendar strip */}
      {/* TODO: add animation for left-right scrolling */}
      <Animated.View
        ref={wrapperRef}
        className={cn(`w-full items-stretch justify-stretch overflow-hidden`)}
        style={animatedStyle}
      >
        {/* Week rows */}
        <FlatList
          data={weeks}
          extraData={[selectedDateKey, expanded, weekOfMonth, anchorDate]}
          renderItem={renderWeekRow}
          scrollEnabled={false}
        />
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
