import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'

import DateTimePicker from '@react-native-community/datetimepicker'
import { useControllableState } from '@rn-primitives/hooks'
import { formatDate } from 'date-fns'
import { CalendarIcon, ClockIcon, RotateCcwIcon, TrashIcon } from '~/lib/icons'
import React, { useState } from 'react'
import { Text, View } from 'react-native'

import { Button } from '~/components/ui/button'

interface BaseDateInputProps {
  value: Date | undefined
  onValueChange: (date: Date | undefined) => void
  show?: boolean
  onShowChange?: (show: boolean) => void
  nativeID?: string
  mode: 'date' | 'time'
}

function BaseDateInput({
  value,
  onValueChange,
  show: showProp,
  onShowChange,
  nativeID,
  mode,
}: BaseDateInputProps) {
  const [date, setDate] = [value, onValueChange]

  const [show, setShow] = useControllableState({
    prop: showProp,
    onChange: onShowChange,
    defaultProp: false,
  })

  function handleButtonPress() {
    setShow(true)
  }

  function handleChange(event: DateTimePickerEvent, selectedDate?: Date) {
    setShow(false)

    if (event.type === 'set') {
      onValueChange(selectedDate)
    }
  }

  return (
    <View className="flex-1">
      <Button
        className={`
          native:py-0 native:gap-3
          flex-row items-center justify-start gap-4 py-0 leading-none
        `}
        variant="outline"
        onPress={handleButtonPress}
      >
        {mode === 'date'
          ? (
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            )
          : (
              <ClockIcon className="h-5 w-5 text-muted-foreground" />
            )}
        {date
          ? (
              <Text className="text-foreground">
                {formatDate(date, mode === 'date'
                  ? 'yyyy-MM-dd'
                  : 'HH:mm')}
              </Text>
            )
          : (
              <Text className="text-lg text-muted-foreground">
                {mode === 'date' ? 'YYYY-MM-DD' : 'HH:mm'}
              </Text>
            )}
      </Button>

      {show && (
        <DateTimePicker
          nativeID={nativeID}
          value={date ?? new Date()}
          mode={mode}
          onChange={handleChange}
        />
      )}
    </View>
  )
}

interface DateInputProps {
  value: Date | undefined
  onValueChange: (date: Date | undefined) => void
  nativeID?: string
  mode: 'date' | 'datetime' | 'time'
}

export function DateInput({
  value,
  onValueChange,
  nativeID,
  mode,
}: DateInputProps) {
  const [tempValue, setTempValue] = useState<Date | null>(null)
  const [timeShow, setTimeShow] = useState(false)

  function handleDateChange(newDate: Date | undefined) {
    if (newDate) {
      if (mode === 'datetime') {
        setTempValue(newDate)
        setTimeShow(true)
      }
      else {
        onValueChange(newDate)
      }
    }
  }

  function handleTimeShowChange(newShow: boolean) {
    setTimeShow(newShow)
    if (!newShow && tempValue) {
      onValueChange(tempValue)
      setTempValue(null)
    }
  }

  function handleTimeChange(newTime: Date | undefined) {
    if (newTime) {
      const dateValue = tempValue || value || new Date()
      dateValue.setHours(newTime.getHours(), newTime.getMinutes(), 0, 0)
      onValueChange(dateValue)
    }
  }

  function handleClear() {
    onValueChange(undefined)
  }

  // TODO: figure out how to use nativeID to make this accessible
  return (
    <View className="flex-row justify-stretch gap-4">
      {mode !== 'time' && (
        <BaseDateInput
          value={value}
          onValueChange={handleDateChange}
          mode="date"
        />
      )}
      {mode !== 'date' && (
        <BaseDateInput
          show={timeShow}
          onShowChange={handleTimeShowChange}
          value={value}
          onValueChange={handleTimeChange}
          mode="time"
        />
      )}
      <Button
        size="icon"
        variant="destructive"
        className="h-12 w-12"
      >
        <TrashIcon
          className="h-6 w-6 text-destructive-foreground"
          onPress={handleClear}
        />
      </Button>
    </View>
  )
}
