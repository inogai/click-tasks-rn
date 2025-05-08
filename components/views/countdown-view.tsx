import { differenceInCalendarDays } from 'date-fns'
import { router } from 'expo-router'
import { Trans } from 'react-i18next'

import { Card, CardHeader } from '~/components/ui/card'
import { Pressable } from '~/components/ui/pressable'
import { Separator } from '~/components/ui/separator'
import { Text, View } from '~/components/ui/text'

import { useRealmQuery } from '~/lib/realm'
import { Countdown } from '~/lib/realm/countdown'
import { cn } from '~/lib/utils'

export function CountdownView() {
  const countdowns = useRealmQuery(Countdown)

  // If there are no countdowns, hide the view
  if (countdowns.length === 0) {
    console.log('No countdowns found')
    return <></>
  }

  return (
    <View className="w-full">
      <Card>
        <CardHeader className={`
          w-full flex-row items-center justify-between gap-6
        `}
        >
          {countdowns.map((countdown, idx) => {
            const daysLeft = differenceInCalendarDays(
              countdown.taskRecord.due!,
              new Date(),
            )
            console.log('Countdown:', countdown.taskRecord.summary, 'Days left:', daysLeft)
            const numberClass = cn(
              'text-3xl font-bold',
              daysLeft <= 7 && 'text-yellow-500',
              daysLeft <= 1 && 'text-red-500',
            )

            return (
              <>
                {idx !== 0 && <Separator orientation="vertical" />}
                <Pressable
                  className="flex-1"
                  key={countdown._id.toHexString()}
                  onPress={() => {
                    router.push({
                      pathname: '/task/update/[taskId]',
                      params: {
                        taskId: countdown.taskRecord._id.toHexString(),
                      },
                    })
                  }}
                >
                  <Text className="line-clamp-1 font-medium">{countdown.taskRecord.summary}</Text>
                  <Text className={`
                    line-clamp-1 w-full justify-end font-medium
                    text-muted-foreground
                  `}
                  >
                    <Trans
                      components={{ 1: <Text className={numberClass} /> }}
                      i18nKey="countdown_view.days_left"
                      values={{ count: daysLeft }}
                    />
                  </Text>
                </Pressable>
              </>
            )
          })}
        </CardHeader>
      </Card>
    </View>
  )
}
