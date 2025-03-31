import { BanknoteIcon, DollarSignIcon } from 'lucide-nativewind'
import * as React from 'react'
import { View } from 'react-native'
import { AmountDisplay } from '~/components/amount-display'
import { Card, CardContent, CardTitle } from '~/components/ui/card'
import { Label } from '~/components/ui/label'

export function ExpenseView() {
  const dailyBalance = -200
  const monthlyBalance = +2000
  const unit = 'HKD'

  return (
    <Card>
      <CardTitle />
      <CardContent>
        <View className="flex-row items-center justify-center">
          <View className="flex-col items-end">
            <Label>Daily</Label>
            <View className="flex-row gap-x-1">
              <DollarSignIcon className="text-foreground" />
              <AmountDisplay amount={dailyBalance} unit={unit} />
            </View>
          </View>

          <View className="mx-4 h-full w-px bg-border" />

          <View className="flex-col items-start">
            <Label>Monthly</Label>
            <View className="flex-row gap-x-1">
              {/* Blocked by lucide-nativewind update */}
              {/* {monthlyBalance > 0 */}
              {/*   ? <BanknoteArrowUpIcon /> */}
              {/*   : <BanknoteArrowDownIcon />} */}
              <BanknoteIcon className="text-foreground" />
              <AmountDisplay amount={monthlyBalance} unit={unit} />
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  )
}
