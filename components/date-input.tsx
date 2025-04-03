import type { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { formatDate } from 'date-fns'
import { CalendarIcon } from 'lucide-nativewind'
import React, { useState } from 'react'
import { SafeAreaView, Text } from 'react-native'
import { Button } from '~/components/ui/button'

interface DateInputProps {
  value: Date | undefined
  onValueChange: (date: Date | undefined) => void
  placeholder?: string
  nativeID?: string
}

export function DateInput({
  value,
  onValueChange,
  placeholder = 'Select date',
  nativeID,
}: DateInputProps) {
  const [date, setDate] = [value, onValueChange]
  const [show, setShow] = useState(false)

  function handleChange(event: DateTimePickerEvent, selectedDate?: Date) {
    setShow(false)
    if (event.type !== 'set') {
      return
    }
    setDate(selectedDate ?? undefined)
  }

  return (
    <SafeAreaView>
      <Button
        className={`
          native:py-0 native:gap-3
          flex-row items-center justify-start gap-4 py-0 leading-none
        `}
        variant="outline"
        onPress={() => setShow(true)}
      >
        <CalendarIcon className="h-6 text-muted-foreground" />
        {date
          ? (
              <Text className="text-foreground">
                {formatDate(date, 'yyyy-MM-dd')}
              </Text>
            )
          : (
              <Text className="text-lg text-muted-foreground">
                {placeholder}
              </Text>
            )}
      </Button>
      {show && (
        <DateTimePicker
          nativeID={nativeID}
          value={date ?? new Date()}
          mode="date"
          onChange={handleChange}
        />
      )}
    </SafeAreaView>
  )
}
