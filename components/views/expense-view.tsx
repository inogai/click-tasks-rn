import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns'
import * as React from 'react'
import { View } from 'react-native'

import { AmountDisplay } from '~/components/amount-display'
import { Label } from '~/components/ui/label'

import { t } from '~/lib/i18n'
import { BanknoteArrowDownIcon, BanknoteArrowUpIcon, DollarSignIcon } from '~/lib/icons'
import { usePreferenceStore } from '~/lib/preference'
import { TxnRecord, useRealmQuery } from '~/lib/realm'
import { R } from '~/lib/utils'

const sumTxn: ((x: TxnRecord[]) => number) = R.piped(
  R.map(x => x.amount),
  R.map(x => Number.parseFloat(x.toString())),
  R.sum(),
)

export function ExpenseView({
  anchorDate,
}: {
  anchorDate: Date
}) {
  const unit = usePreferenceStore(store => store.preferedCurrency)

  const dailyTxn = useRealmQuery({
    type: TxnRecord,
    query: collection => collection
      .filtered('date >= $0 && date <= $1', startOfDay(anchorDate), endOfDay(anchorDate))
      .filtered('account.currency == $0', unit),
  }, [anchorDate, unit])

  const dailyBalance = sumTxn(Array.from(dailyTxn))

  const monthlyTxn = useRealmQuery({
    type: TxnRecord,
    query: collection => collection
      .filtered('date >= $0 && date <= $1', startOfMonth(anchorDate), endOfMonth(anchorDate))
      .filtered('account.currency == $0', unit),
  }, [anchorDate, unit])

  const monthlyBalance = sumTxn(Array.from(monthlyTxn))

  return (
    <View className="flex-row items-center justify-center">
      <View className="flex-col items-end">
        <Label>{t('expenses_view.daily_balance.title')}</Label>
        <View className="flex-row gap-x-1">
          <DollarSignIcon className="text-foreground" />
          <AmountDisplay amount={dailyBalance} unit={unit} />
        </View>
      </View>

      <View className="mx-4 h-full w-px bg-border" />

      <View className="flex-col items-start">
        <Label>{t('expenses_view.monthly_balance.title')}</Label>
        <View className="flex-row gap-x-1">
          {monthlyBalance > 0
            ? <BanknoteArrowUpIcon />
            : <BanknoteArrowDownIcon />}
          <AmountDisplay amount={monthlyBalance} unit={unit} />
        </View>
      </View>
    </View>
  )
}
