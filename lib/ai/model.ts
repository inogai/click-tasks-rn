import type { BaseChatModel } from '@langchain/core/language_models/chat_models'

import { ChatDeepSeek } from '@langchain/deepseek'

export function getModel(): BaseChatModel {
  return new ChatDeepSeek({
    model: 'deepseek-chat',
    temperature: 0,
    apiKey: '<DEEPSEEK_API_KEY>',
    // Ideally, you would make requests on your server, and this should be your own server's endpoint and API (with ratelimit)
    // For simplicity of this mobile-app projects, we will demo with a direct API call.
  })
}
