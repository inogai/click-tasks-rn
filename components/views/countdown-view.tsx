import { FlashList } from '@shopify/flash-list'
import { differenceInCalendarDays } from 'date-fns'
import { router } from 'expo-router'
import { Trans } from 'react-i18next'

import { Card, CardHeader } from '~/components/ui/card'
import { Pressable } from '~/components/ui/pressable'
import { Separator } from '~/components/ui/separator'
import { Text, View } from '~/components/ui/text'

import { TaskRecord, useRealmQuery } from '~/lib/realm'
import { cn } from '~/lib/utils'

export function CountdownView() {
  const countdowns = useRealmQuery({
    type: TaskRecord,
    query: c => c
      .filtered('countdown == true'),
  })

  // If there are no countdowns, hide the view
  if (countdowns.length === 0) {
    console.log('No countdowns found')
    return <></>
  }

  return (
    <View className="h-28 w-full">
      <Card>
        <CardHeader className={`
          w-full flex-row items-center justify-between gap-6 p-0
        `}
        >
          <FlashList
            contentContainerStyle={{ padding: 24 }}
            data={Array.from(countdowns)}
            estimatedItemSize={119} // size for w-28, since we don't care about optimization for len < 3
            ItemSeparatorComponent={() => <Separator className="mx-6" orientation="vertical" />}
            keyExtractor={task => task._id.toHexString()}
            horizontal
            renderItem={({ item: countdown }) => {
              const daysLeft = countdown.plannedBegin
                ? differenceInCalendarDays(
                    countdown.plannedBegin,
                    new Date(),
                  )
                : Number.NaN
              const numberClass = cn(
                'text-3xl font-bold',
                daysLeft <= 7 && 'text-yellow-500',
                daysLeft <= 1 && 'text-red-500',
              )

              return (
                <>
                  <Pressable
                    className={cn(
                      'w-56',
                      countdowns.length >= 2 && 'w-40',
                      countdowns.length >= 3 && 'w-28',
                    )}
                    onPress={() => {
                      router.push({
                        pathname: '/task/update/[taskId]',
                        params: {
                          taskId: countdown._id.toHexString(),
                        },
                      })
                    }}
                  >
                    <Text className="line-clamp-1 font-medium">{countdown.summary}</Text>
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
            }}
          />
        </CardHeader>
      </Card>
    </View>
  )
}
