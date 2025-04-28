/* eslint-disable no-console */
import type { Realm } from '@realm/react'

import { ChatDeepSeek } from '@langchain/deepseek'
import { formatDate } from 'date-fns'
import { z } from 'zod'

import { TaskRecord, TxnAccount, TxnRecord } from '~/lib/realm'

const resultSchema = z.object({
  tasks: z.array(TaskRecord.zodSchema).optional(),
  transactions: z.array(TxnRecord.zodSchema).optional(),
  // TODO: will add expenses and feeling journal later
})

export type IntentionRecognitionResult = z.infer<typeof resultSchema>

export async function intentionRecognition(message: string, realm: Realm) {
  // TODO: maybe allow user to select their own model and API keys
  const model = new ChatDeepSeek({
    model: 'deepseek-chat',
    temperature: 0,
    apiKey: 'sk-2c112dc2deae4476b38e8438f4194c70',
  }).withStructuredOutput(resultSchema)

  console.log('User: ', message)

  const txnAccounts = realm.objects(TxnAccount)

  const result = await model.invoke([
    ['system', 'You are a helpful assistant that helps users to create to-do tasks and transaction logs.'],
    ['system', `Time now is ${formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss X')}`],
    ['system', `Available TxnAccounts: ${JSON.stringify(txnAccounts)}`],
    ['system', `Fill the plannedBegin and plannedEnd fields if time is specified. If duration is unknown, please estimate it.`],
    message,
  ])

  console.log('Assistant', result)

  return result
}
