import { registerRootComponent } from 'expo'
import { ExpoRoot } from 'expo-router'
import { createElement } from 'react'

import 'react-native-get-random-values'
import { ReadableStream } from 'web-streams-polyfill'

globalThis.ReadableStream = ReadableStream

// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app')
  return createElement(ExpoRoot, { context: ctx })
}

registerRootComponent(App)
