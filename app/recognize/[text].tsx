import type { IntentionRecognitionResult } from '~/lib/intention-recognition'

import { useRealm } from '@realm/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RecognizeCard } from '~/components/recognize-card'
import { Separator } from '~/components/ui/separator'
import { Text, View } from '~/components/ui/text'
import { BlockQuote, H4 } from '~/components/ui/typography'

import { t } from '~/lib/i18n'
import { intentionRecognition } from '~/lib/intention-recognition'

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
  let { text } = useLocalSearchParams<'/recognize/[text]'>()
  text = 'Tommorrow 9am take a cup of tea. Cash 10USD.'
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
