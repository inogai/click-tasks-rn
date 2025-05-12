import type { IntentionRecognitionResult } from '~/lib/intention-recognition'

import { useRealm } from '@realm/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback, useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ActionButton } from '~/components/action-button'
import { RecognizeCard } from '~/components/recognize-card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { BlockQuote, H4 } from '~/components/ui/typography'

import { t } from '~/lib/i18n'
import { CheckIcon } from '~/lib/icons'
import { intentionRecognition } from '~/lib/intention-recognition'
import { TaskRecord, TxnRecord } from '~/lib/realm'

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

  const [isSubmitting, setIsSubmitting] = useState(false)
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
    setIsSubmitting(false)
    if (isFetching || isPending) {
      return
    }
    refetch()
  }, []))

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

  function handleActionButtonPress() {
    if (isSubmitting) {
      return
    }
    setIsSubmitting(true)

    try {
      realm.write(() => {
        if (data) {
          const { tasks, transactions } = data
          tasks?.forEach((task) => {
            TaskRecord.create(task, realm)
          })
          transactions?.forEach((txn) => {
            TxnRecord.create(txn, realm)
          })
        }
      })
    }
    catch (e) {
      console.error('Error writing to realm:', e)
      return
    }

    console.log('Data written to realm successfully')
    router.back()
  }

  return (
    <SafeAreaView edges={['left', 'right']}>
      <ActionButton disabled={isPending || isFetching} onPress={handleActionButtonPress}>
        <CheckIcon />
      </ActionButton>

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
                    <RecognizeCard
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      task={task}
                      type="task"
                      onEdit={(value) => {
                        mutation.mutate({ index, value, type: 'tasks', context: data })
                      }}
                    />
                  ))}
                  {data.transactions?.map((txn, index) => (
                    <RecognizeCard
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      txn={txn}
                      type="txn"
                      onEdit={(value) => {
                        mutation.mutate({ index, value, type: 'transactions', context: data })
                      }}
                    />
                  ))}
                </View>
              </>
            )}
      </View>
    </SafeAreaView>
  )
}
