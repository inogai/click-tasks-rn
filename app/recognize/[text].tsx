import type { IntentionRecognitionResult } from '~/lib/intention-recognition'
import type { ITaskRecord, ITxnRecord } from '~/lib/realm'
import type { VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react-native'
import type { ReactNode } from 'react'

import { useRealm } from '@realm/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cva } from 'class-variance-authority'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BSON } from 'realm'

import { TaskForm, useTaskForm } from '~/components/task-form'
import { Button } from '~/components/ui/button'
import { Card, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import { Text, View } from '~/components/ui/text'
import { BlockQuote, H4 } from '~/components/ui/typography'

import { t } from '~/lib/i18n'
import { BookIcon, CalendarIcon, CircleDollarSignIcon, ClockIcon, MapPinIcon, PencilIcon } from '~/lib/icons'
import { intentionRecognition } from '~/lib/intention-recognition'
import { TxnAccount, useRealmObject } from '~/lib/realm'
import { smartFormatDate, smartFormatDateRange } from '~/lib/utils/format-date-range'

const cardVariant = cva(
  'flex-row items-stretch overflow-hidden rounded-md border-l-4',
  {
    variants: {
      type: {
        task: 'border-l-blue-500',
        txn: 'border-l-green-500',
      },
    },
  },
)

const tagsVariant = cva(
  'rounded-full px-2 py-0.5 text-sm font-semibold',
  {
    variants: {
      type: {
        task: 'bg-blue-100 text-blue-800',
        txn: 'bg-green-100 text-green-800',
      },
    },
  },
)

type CardLine = [LucideIcon, string]

interface BaseCardProps extends VariantProps<typeof cardVariant> {
  title: string
  titleTag: string
  lines: (CardLine | '' | null | undefined)[]
  renderRightBtn?: (props: { className?: string, iconClass?: string }) => ReactNode
}

function BaseCard({
  title,
  titleTag,
  lines,
  renderRightBtn,
  ...props
}: BaseCardProps) {
  return (
    <Card className={cardVariant(props)}>
      <View className="flex-1 p-4 pr-0">
        <View className="mb-2 flex-row items-center gap-4">
          <CardTitle className="pt-1">{title}</CardTitle>
          <Text className={tagsVariant(props)}>{titleTag}</Text>
        </View>

        <View className="gap-1">
          {lines
            .filter(line => !!line)
            .map(([IconComp, text]) => (
              <View className="flex-row items-center gap-1" key={text}>
                <IconComp className="h-5 text-muted-foreground" />
                <Text className="text-sm text-muted-foreground">{text}</Text>
              </View>
            ))}
        </View>
      </View>

      {renderRightBtn && renderRightBtn({
        className: 'h-auto w-12',
        iconClass: 'h-5 w-5',
      })}
    </Card>
  )
}

function TaskCard({
  task,
  onEdit,
}: {
  task: ITaskRecord
  onEdit: (task: ITaskRecord) => void
}) {
  const {
    due,
    plannedBegin,
    plannedEnd,
    summary,
    venue,
  } = task

  const [editDialog, setEditDialog] = useState(false)
  const editForm = useTaskForm()

  useEffect(() => {
    editForm.reset({ ...task })
  }, [editDialog])

  function handleEditSubmit(data: ITaskRecord) {
    setEditDialog(false)
    onEdit(data)
  }

  return (
    <BaseCard
      title={summary}
      titleTag="Task"
      type="task"
      lines={[
        due && [ClockIcon, smartFormatDate(due)],
        plannedBegin && [CalendarIcon, smartFormatDateRange(plannedEnd!, plannedBegin)],
        venue && [MapPinIcon, venue],
      ]}
      renderRightBtn={({ className, iconClass }) => (
        <Dialog className={className} open={editDialog} onOpenChange={setEditDialog}>
          <DialogTrigger asChild>
            <Button className="w-full flex-1 rounded-none" size="icon" variant="default">
              <PencilIcon className={iconClass} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <TaskForm form={editForm} onSubmit={handleEditSubmit} />
          </DialogContent>
        </Dialog>
      )}
    />
  )
}

function TxnCard({ txn }: { txn: ITxnRecord }) {
  const {
    accountId,
    amount,
    date,
    summary,
  } = txn

  const account = useRealmObject({ type: TxnAccount, primaryKey: new BSON.ObjectId(accountId) })

  if (!account) {
    console.error('Account not found')
    return
  }

  return (
    <BaseCard
      title={summary}
      titleTag={Number.parseFloat(amount) > 0 ? 'Income' : 'Expense'}
      type="txn"
      lines={[
        [BookIcon, account.name],
        date && [CalendarIcon, smartFormatDate(date)],
        [CircleDollarSignIcon, `${account.currency} ${amount}`],
      ]}
    />
  )
}

async function localMutate({
  type,
  index,
  value,
  context,
}: {
  type: 'tasks' | 'transactions'
  index: number
  value: any
  context: IntentionRecognitionResult
}) {
  // @ts-expect-error not iterator signatur
  const newArr = [...context[type]]
  newArr[index] = value

  return {
    ...context,
    [type]: newArr,
  }
}

export default function RecognizationScreen() {
  const { text } = useLocalSearchParams<'/recognize/[text]'>()
  const realm = useRealm()

  const { isPending, error, data, refetch, isFetching } = useQuery({
    queryKey: ['recognization', text],
    queryFn: () => intentionRecognition(text ?? '', realm),
    refetchInterval: 0,
  })
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: localMutate,
    onSuccess: (data) => {
      queryClient.setQueryData(['recognization', text], data)
    },
  })

  useFocusEffect(useCallback(() => {
    if (isFetching || isPending) {
      return
    }
    refetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]))

  if (!text) {
    router.replace('/+not-found')
  }

  if (error) {
    return (
      <Text>
        An error has occurred:
        {error.message}
      </Text>
    )
  }

  return (
    <SafeAreaView edges={['left', 'right']}>
      <View className="h-full p-4">
        <H4>
          {t('recognize.transcribed.label')}
        </H4>
        <BlockQuote className="mx-2 bg-secondary p-2">{text}</BlockQuote>

        <Separator className="my-4" />

        { isPending || isFetching
          ? <Text>Loading...</Text>
          : (
              <>
                <H4>
                  {t('recognize.result.label')}
                </H4>
                <View className="gap-4 p-2">
                  {data.tasks?.map((task, index) => (
                    <TaskCard
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      task={task}
                      onEdit={(value) => {
                        mutation.mutate({
                          index,
                          value,
                          type: 'tasks',
                          context: data,
                        })
                      }}
                    />
                  ))}
                  {data.transactions?.map((txn, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <TxnCard key={index} txn={txn} />
                  ))}
                </View>
              </>
            )}
      </View>
    </SafeAreaView>
  )
}
