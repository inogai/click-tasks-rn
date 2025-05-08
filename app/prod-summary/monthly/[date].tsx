import { useQuery } from '@tanstack/react-query'
import { endOfMonth, formatDate, startOfMonth } from 'date-fns'
import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { z } from 'zod'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { Select } from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { Text, View } from '~/components/ui/text'

import { getModel } from '~/lib/ai/model'
import { t } from '~/lib/i18n'
import { usePreferenceStore } from '~/lib/preference'
import { TaskRecord, TaskStatus, TxnAccount, TxnRecord, useRealmQuery } from '~/lib/realm'
import { R } from '~/lib/utils'

const paramsSchema = z.object({
  date: z.string().date().pipe(z.coerce.date()), // YYYY-MM-DD -> Date
})

function parseParams(params: unknown) {
  const { error, success, data } = paramsSchema.safeParse(params)

  if (error) {
    return {
      date: new Date(),
    }
  }

  return data
}

const model = getModel()

const promptTemplate = `
You are a productivity assistant. You will be given a list of tasks and transactions.
- give concise recommendations to arrange task to improve productivity
- don't repeat the tasks and transactions.
- don't suggest changes to the data format
- don't suggest recurrent schedules
`

interface SummaryItem {
  title: string
  value: number
  suffix?: string
}

function SummaryCard({
  summary,
}: {
  summary: SummaryItem[]
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-6">
        {summary
          .map(({ title, value, suffix }, idx) => (
            <React.Fragment key={title}>
              {idx !== 0 && <Separator orientation="vertical" />}
              <View className="flex-1 basis-0">
                <CardDescription>{title}</CardDescription>
                <View className="flex-row items-baseline justify-between">
                  <CardTitle className="text-2xl tabular-nums">
                    {value}
                  </CardTitle>
                  <Text className="text-muted-foreground">{suffix}</Text>
                </View>
              </View>
            </React.Fragment>
          ))}
      </CardHeader>
    </Card>
  )
}

function useProductiveSummary({
  begin,
  end,
  currency,
}: {
  begin: Date
  end: Date
  currency: string
}) {
  const tasks = Array.from(useRealmQuery({
    type: TaskRecord,
    query: collection => collection
      .filtered([
        'due >= $0 && due <= $1',
        'plannedEnd >= $0 && plannedBegin <= $1',
      ]
        .map(it => `(${it})`)
        .join('||'), begin, end),
  }, [begin, end]))

  const counts = R.countBy(tasks, x => x.status)
  const tasksSummary = [
    { title: 'Total Tasks', value: tasks.length },
    { title: 'On Time', value: counts[TaskStatus.COMPLETED] ?? 0 },
    { title: 'Overdue', value: counts[TaskStatus.OVERDUE_COMPLETED] ?? 0 },
  ]

  const txns = Array.from(useRealmQuery({
    type: TxnRecord,
    query: collection => collection
      .filtered('date >= $0 && date <= $1', begin, end),
  }, [begin, end]))

  const amounts = R.pipe(
    txns,
    R.filter(x => x.account?.currency === currency),
    R.map(it => it.amount),
    R.map(it => Number.parseFloat(it.toString())),
  )
  const totalIncome = R.pipe(
    amounts,
    R.filter(it => it > 0),
    R.sum(),
  )
  const totalExpense = R.pipe(
    amounts,
    R.filter(it => it < 0),
    R.sum(),
  )

  const txnsSummary = [
    { title: 'Transactions', value: amounts.length },
    { title: 'Total Income', value: totalIncome, suffix: currency },
    { title: 'Total Expense', value: totalExpense, suffix: currency },
  ]

  const comment = useQuery({
    queryKey: ['recognization'],
    queryFn: async () => {
      console.log('refetching')
      const info = JSON.stringify({
        tasks: tasks.map(x => x.toModel()),
        txns: txns.map(x => x.toModel()),
      })

      console.log('info', info)

      const resp = await model.invoke([
        ['system', promptTemplate],
        ['system', `Time now: ${formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss\'Z')}`],
        ['user', info],
      ])
      return resp.text
    },
  })

  return {
    tasksSummary,
    txnsSummary,
    comment,
  }
}

export default function ProductivitySummaryScreen() {
  const params = useLocalSearchParams<'/prod-summary/monthly/[date]'>()

  const { date } = parseParams(params)

  const monthBegin = startOfMonth(date)
  const monthEnd = endOfMonth(date)

  const preferedCurrency = usePreferenceStore(store => store.preferedCurrency)
  const [currency, setCurrency] = useState<string>(preferedCurrency)
  const { tasksSummary, txnsSummary, comment } = useProductiveSummary({
    begin: monthBegin,
    end: monthEnd,
    currency,
  })

  const txnAccounts = Array.from(useRealmQuery({ type: TxnAccount }))
  const currencies = R.pipe(
    txnAccounts,
    R.map(x => x.currency),
    it => [...it, preferedCurrency],
    R.unique(),
    R.map(x => ({ label: x, value: x })),
  )
  console.log('currencies', currencies)

  useFocusEffect(useCallback(() => {
    comment.refetch()
  }, [comment.refetch]))

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={['left', 'right', 'bottom']}
    >
      <View className="flex-1 gap-y-4 px-4 py-6">
        <SummaryCard summary={tasksSummary} />
        <Label>{t('prod_summary.currency.label')}</Label>
        <Select
          options={currencies}
          value={currency}
          onChange={x => typeof x === 'string' ? setCurrency(x) : setCurrency(preferedCurrency)}
        />
        <SummaryCard summary={txnsSummary} />

        {comment.isFetching
          ? <Text>Loading...</Text>
          : <Text>{comment.data}</Text>}
      </View>
    </SafeAreaView>
  )
}
