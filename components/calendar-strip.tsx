import type { Day } from 'date-fns'
import { FlashList } from '@shopify/flash-list'
import { addDays, formatDate, startOfWeek } from 'date-fns'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-nativewind'
import { useLayoutEffect, useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { cn, R } from '~/lib/utils'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface DaylistItem {
  date: Date
  dayOfMonth: number
  dayOfWeek: number
  key: string
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
  expanded: boolean
  weekStartsOn?: Day
  className?: string
}

export function CalendarStrip({
  selectedDate,
  onSelectedDateChange,
  expanded,
  weekStartsOn,
  className,
}: CalendarStripProps) {
  const [anchorDate, setAnchorDate] = useState(startOfWeek(selectedDate, { weekStartsOn }))

  const selectedDateKey = formatDate(selectedDate, 'yyyy-MM-dd')

  const [daylist, setDaylist] = useState(() => computeDaylist(anchorDate))

  const wrapperRef = useRef<View>(null)
  const listRef = useRef<FlashList<any>>(null)
  const [width, setWidth] = useState(20)

  const [scrollIndicater, setScrollIndicater] = useState<null | 'left' | 'right'>(null)

  const [scrolling, setScrolling] = useState(false)

  function loadLeft() {
    setAnchorDate(addDays(anchorDate, -7))
    setDaylist(computeDaylist(addDays(anchorDate, -7)))
  }

  function loadRight() {
    setAnchorDate(addDays(anchorDate, 7))
    setDaylist(computeDaylist(addDays(anchorDate, 7)))
  }

  useLayoutEffect(() => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    wrapperRef.current?.measure((x, y, w, h) => {
      setWidth(w / 7)
    })
  })

  return (
    <View className={cn('flex flex-col items-center gap-2', className)}>
      <View>
        <Text className="font-semibold text-muted-foreground">
          {formatDate(anchorDate, 'MMMM yyyy')}
        </Text>
      </View>
      <View
        ref={wrapperRef}
        className={cn('relative h-16 w-full')}
      >
        <View className={cn(
          `
            pointer-events-box-none absolute flex h-full w-full flex-row
            items-center justify-between
          `,
        )}
        >
          <ArrowLeftCircleIcon className={cn('text-blue-400', scrollIndicater !== 'left' && `
            opacity-0
          `)}
          />
          <ArrowRightCircleIcon className={cn('text-blue-400', scrollIndicater !== 'right' && `
            opacity-0
          `)}
          />
        </View>
        <FlashList
          ref={listRef}
          data={daylist}
          extraData={selectedDateKey}
          horizontal
          initialScrollIndex={7}
          estimatedItemSize={width}
          keyExtractor={item => item.key}
          renderItem={({ item }) => {
            const selected = item.key === selectedDateKey
            return (
              <TouchableOpacity
                onPress={() => onSelectedDateChange(item.date)}
              >
                <View
                  className={cn(
                    `flex h-full flex-col items-center justify-center`,
                    selected && 'rounded-full bg-primary',
                  )}
                  style={{ width }}
                >

                  <Text className={cn(
                    'text-sm font-semibold text-muted-foreground',
                    selected && 'text-primary-foreground',
                    item.dayOfWeek === 0 && 'text-red-500',
                  )}
                  >
                    {daysOfWeek[item.dayOfWeek]}
                  </Text>
                  <Text className={cn(
                    'text-foreground',
                    selected && 'text-primary-foreground',
                    item.dayOfWeek === 0 && 'text-red-500',
                  )}
                  >
                    {item.dayOfMonth}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }}
          onScrollEndDrag={() => {
            setScrolling(false)
            if (scrollIndicater === 'left') {
              loadLeft()
            }
            else if (scrollIndicater === 'right') {
              loadRight()
            }
            setScrollIndicater(null)
            listRef.current?.scrollToIndex({ index: 1, animated: true })
          }}
          onScrollBeginDrag={() => {
            setScrolling(true)
          }}
          onScroll={(e) => {
            if (!scrolling) {
              return
            }

            const offset = e.nativeEvent.contentOffset.x
            if (offset <= 0) {
              setScrollIndicater('left')
            }
            else if (offset >= width) {
              setScrollIndicater('right')
            }
            else {
              setScrollIndicater(null)
            }
          }}
        />
      </View>
    </View>
  )
}
