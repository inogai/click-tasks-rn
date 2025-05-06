import type { ViewStyle } from 'react-native'

import { cva } from 'class-variance-authority'
import { Text, TouchableOpacity, View } from 'react-native'

import { isHoliday } from '~/lib/holidays'
import { t } from '~/lib/i18n'
import { cn, R } from '~/lib/utils'

interface DotsProps {
  count?: number
  selected?: boolean
}

function Dots({
  count = 1,
  selected = false,
}: DotsProps) {
  if (count === 0)
    return null

  return (
    <View className={`
      absolute bottom-1 flex-row items-center justify-center gap-1
    `}
    >
      {R.range(0, count).map(x => (
        <View
          key={x}
          className={cn(
            'h-1 w-1 rounded-full bg-primary',
            selected && 'bg-primary-foreground',
          )}
        />
      ))}
    </View>
  )
}

const dayContainerVariants = cva(
  'flex flex-col items-center justify-center overflow-hidden',
  {
    variants: {
      selected: {
        true: 'rounded-xl bg-primary',
        false: '',
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
)

const dayNameVariants = cva(
  'text-sm font-semibold text-muted-foreground',
  {
    variants: {
      variant: {
        holiday: 'text-red-500',
        saturday: 'text-blue-500',
        default: '',
      },
      selected: {
        true: 'text-primary-foreground',
        false: '',
      },
      active: {
        true: '',
        false: 'opacity-50',
      },
    },
    defaultVariants: {
      selected: false,
      variant: 'default',
    },
  },
)

const dayNumberVariants = cva(
  'text-foreground',
  {
    variants: {
      variant: {
        holiday: 'font-semibold text-red-500',
        saturday: 'font-semibold text-blue-500',
        default: '',
      },
      selected: {
        true: 'text-primary-foreground',
        false: '',
      },
      active: {
        true: '',
        false: 'opacity-50',
      },
    },
    defaultVariants: {
      selected: false,
      variant: 'default',
      active: true,
    },
  },
)

enum DateVariant {
  HOLIDAY = 'holiday',
  SATURDAY = 'saturday',
  DEFAULT = 'default',
}

function getDateVariant(date: Date) {
  if (isHoliday(date)) {
    return DateVariant.HOLIDAY
  }

  if (date.getDay() === 6) {
    return DateVariant.SATURDAY
  }

  return DateVariant.DEFAULT
}

export interface CalendarDayProps {
  date: Date
  selected?: boolean
  active?: boolean
  onSelectedChange?: (selected: boolean) => void
  style?: ViewStyle
  className?: string
  numTasks?: number
}

export function CalendarDay({
  date,
  selected,
  active = true,
  onSelectedChange,
  style,
  className,
  numTasks = 0,
}: CalendarDayProps) {
  const dayOfMonth = date.getDate()
  const variant = getDateVariant(date)

  const handlePress = () => {
    onSelectedChange?.(!selected)
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
    >
      <View
        className={cn(dayContainerVariants({ selected }), className)}
        style={style}
        accessibilityLabel={t('calendar_day.label', {
          date,
          numTasks,
        })}
      >
        <Text
          className={cn(dayNameVariants({
            selected,
            variant,
            active,
          }))}
        >
          {t('calendar_day.week_of_day.display', {
            date,
          })}
        </Text>
        <Text
          className={cn(dayNumberVariants({
            selected,
            variant,
            active,
          }))}
        >
          { dayOfMonth }
        </Text>
        <Dots
          count={numTasks}
          selected={selected}
        />
      </View>
    </TouchableOpacity>
  )
}
