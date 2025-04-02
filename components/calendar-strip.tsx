import type { Day } from 'date-fns'
import { addDays, addMonths, addWeeks, differenceInDays, differenceInWeeks, formatDate, getWeek, startOfMonth, startOfWeek } from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-nativewind'
import { useCallback, useMemo, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { CalendarDay } from '~/components/calendar-day'
import { EvenList } from '~/components/even-list'
import { Button } from '~/components/ui/button'
import { t } from '~/lib/i18n'
import { cn, R } from '~/lib/utils'

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

function getWeekIndex(month: Date, weekStartsOn: Day, date: Date) {
  const firstDayOfMonth = startOfMonth(month)
  const firstDayOfCalendar = startOfWeek(firstDayOfMonth, { weekStartsOn })

  const dayFromPreviousMonth = differenceInDays(firstDayOfMonth, firstDayOfCalendar)

  const weekOffset = dayFromPreviousMonth !== 0
    ? 0
    : -1

  return differenceInWeeks(date, firstDayOfCalendar) + weekOffset
}

interface CalendarWeekProps {
  week: Date
  selectedDate: Date
  onDayItemPress: (date: Date) => void
  weekStartsOn?: Day
}

function CalendarWeek({
  week,
  selectedDate,
  onDayItemPress,
  weekStartsOn = 0,
}: CalendarWeekProps) {
  const selectedDateKey = formatDate(selectedDate, 'yyyy-MM-dd')

  const weekStart = startOfWeek(week, { weekStartsOn })
  const weekDays = R.range(0, 7)
    .map(x => addDays(weekStart, x))
    .map(date => ({ key: formatDate(date, 'yyyy-MM-dd'), date }))

  return (
    <EvenList
      data={weekDays}
      horizontal
      keyExtractor={x => x.key}
      renderItem={({ item: { date, key }, mainDim: width }) => {
        return (
          <CalendarDay
            style={{ width }}
            className="h-full"
            date={date}
            key="key"
            selected={selectedDateKey === key}
            onSelectedChange={value => value && onDayItemPress(date)}
          />
        )
      }}
    />
  )
}

interface CalendarGridProps {
  month: Date
  selectedDate: Date
  onDayItemPress: (date: Date) => void
  weekStartsOn?: Day
}

function CalendarGrid({
  month,
  selectedDate,
  onDayItemPress,
  weekStartsOn = 0,
}: CalendarGridProps) {
  const monthNr = month.getMonth()
  const selectedDateKey = formatDate(selectedDate, 'yyyy-MM-dd')

  const weeks = useMemo(() => getWeekRows(month, weekStartsOn), [month, weekStartsOn])

  const renderWeekRow = useCallback(({ item }: { item: Date[], index: number }) => {
    return (
      <View
        className="h-16 w-full"
      >
        <EvenList
          data={item}
          horizontal
          renderItem={({ item: date, mainDim: width }) => {
            const key = formatDate(date, 'yyyy-MM-dd')
            const isSelected = selectedDateKey === key

            return (
              <CalendarDay
                style={{ width }}
                date={date}
                className="h-full"
                selected={isSelected}
                onSelectedChange={value => value && onDayItemPress(date)}
                active={date.getMonth() === monthNr}
              />
            )
          }}
        />
      </View>
    )
  }, [monthNr, onDayItemPress, selectedDateKey])

  return (
    <FlatList
      data={weeks}
      renderItem={renderWeekRow}
      scrollEnabled={false}
    />
  )
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
  const [anchorDate, setAnchorDate] = useState(selectedDate)

  const month = useMemo(() => startOfMonth(anchorDate), [anchorDate])
  const weekIndex = useMemo(
    () => getWeekIndex(month, weekStartsOn, anchorDate),
    [anchorDate, month, weekStartsOn],
  )

  const [controlledExpanded, setControlledExpanded] = useState(initialExpaned)

  if (expanded === undefined) {
    expanded = controlledExpanded
    setExpanded = setControlledExpanded
  }

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
            week: getWeek(anchorDate),
          })}
        </Text>
        <Button size="icon" variant="ghost" onPress={loadRight}>
          <ChevronRightIcon className="text-foreground" />
        </Button>
      </View>

      {/* Calendar strip */}
      {/* TODO: add animation for left-right scrolling */}
      <View className={cn(
        'relative h-96 w-full transition-[height] duration-1000',
        !expanded && 'h-16',
      )}
      >
        <View className={cn(
          'w-full',
        )}
        >
          <CalendarGrid
            month={month}
            selectedDate={selectedDate}
            onDayItemPress={handleDayItemPress}
            weekStartsOn={weekStartsOn}
          />
        </View>

        <View
          className={cn(
            `absolute top-0 z-10 h-16 w-full bg-background`,
            'opacity-100 transition-[top,opacity] duration-1000',
            expanded && 'opacity-0',
            expanded && ['top-0', 'top-16', 'top-32', 'top-48', 'top-64', `
              top-80
            `][weekIndex],
          )}
        >
          <CalendarWeek
            week={anchorDate}
            selectedDate={selectedDate}
            onDayItemPress={handleDayItemPress}
            weekStartsOn={weekStartsOn}
          />
        </View>
      </View>

      <TouchableOpacity
        className="-mb-4 h-4 w-32"
        onPress={() => { setExpanded?.(!expanded) }}
      >
        <View className="h-1 rounded-full bg-border" />
      </TouchableOpacity>
    </View>
  )
}
