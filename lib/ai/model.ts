import type { BaseChatModel } from '@langchain/core/language_models/chat_models'

import { ChatDeepSeek } from '@langchain/deepseek'

export function getModel(): BaseChatModel {
  return new ChatDeepSeek({
    model: 'deepseek-chat',
    temperature: 0,
    apiKey: 'sk-2c112dc2deae4476b38e8438f4194c70',
  })
}
