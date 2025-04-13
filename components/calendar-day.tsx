import type { ViewStyle } from 'react-native'

import { cva } from 'class-variance-authority'
import { Text, TouchableOpacity, View } from 'react-native'

import { isHoliday } from '~/lib/holidays'
import { t } from '~/lib/i18n'
import { cn } from '~/lib/utils'

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
  renderDots?: () => React.ReactNode
}

export function CalendarDay({
  date,
  selected,
  active = true,
  onSelectedChange,
  style,
  className,
  renderDots,
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
        style={style}
        className={cn(dayContainerVariants({ selected }), className)}
      >
        <Text
          className={cn(dayNameVariants({
            selected,
            variant,
            active,
          }))}
        >
          {t('calendar.weekday.narrow', {
            val: date,
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
        {renderDots?.()}
      </View>
    </TouchableOpacity>
  )
}
