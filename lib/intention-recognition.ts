/* eslint-disable no-console */
import { ChatDeepSeek } from '@langchain/deepseek'
import { formatDate } from 'date-fns'
import { z } from 'zod'

import { TaskRecord } from '~/lib/realm'

const resultSchema = z.object({
  tasks: z.array(TaskRecord.zodSchema),
  // TODO: will add expenses and feeling journal later
})

export async function intentionRecognition(message: string) {
  // TODO: maybe allow user to select their own model and API keys
  const model = new ChatDeepSeek({
    model: 'deepseek-chat',
    temperature: 0,
    apiKey: 'sk-2c112dc2deae4476b38e8438f4194c70',
  }).withStructuredOutput(resultSchema)

  console.log('User: ', message)

  const result = await model.invoke([
    ['system', 'You are a helpful assistant that helps users to create to-do tasks'],
    ['system', `Time now is ${formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss X')}`],
    message,
  ])

  console.log('Assistant', result)

  return result
}
