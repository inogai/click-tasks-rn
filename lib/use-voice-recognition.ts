import Voice from '@react-native-voice/voice'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { usePreferenceStore } from '~/lib/preference'

export interface UseVoiceRecognitionReturn {
  isRecording: boolean
  partialResult: string
  result: string | null
  startRecord: () => void
  stopRecord: () => void
}

export function useVoiceRecognition() {
  const [isRecording, setIsRecording] = useState(false)
  const [partialResult, setPartialResult] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const [storedResult, setStoredResult] = useState<string>('')
  const [isDeliberatelyStopped, setIsDeliberatelyStopped] = useState(false)

  const locale = usePreferenceStore(store => store.speechLanguage)

  function startRecord() {
    setIsRecording(true)
    setPartialResult('')
    setResult(null)
    setStoredResult('')
    setIsDeliberatelyStopped(false)
    Voice.start(locale)
  }

  function stopRecord() {
    setIsRecording(false)
    setResult(partialResult)
    Voice.stop()
  }

  useEffect(() => {
    (async () => {
      // TODO: prompt user to install the Google Speech Recognition if not found
      // TODO: prompt user to give permission to Google Speech Recognition
      const ok = await Voice.getSpeechRecognitionServices()
    })()

    Voice.onSpeechStart = () => {
      console.log('speechStart')
    }

    Voice.onSpeechEnd = (_e) => {
      setIsDeliberatelyStopped(true)
    }

    Voice.onSpeechError = (e) => {
      console.warn('speechError', e)
      setIsDeliberatelyStopped(true)
    }

    Voice.onSpeechPartialResults = (e) => {
      if (e.value && e.value.length > 0) {
        setPartialResult(e.value[0])
      }
    }

    Voice.onSpeechResults = (e) => {
      setIsDeliberatelyStopped(true)
      if (e.value && e.value.length > 0) {
        setPartialResult(e.value[0])
      }
    }
  }, [])

  if (Platform.OS === 'android' && isDeliberatelyStopped && isRecording) {
    setIsDeliberatelyStopped(false)
    setStoredResult(prev => `${prev} ${partialResult} //\n`)
    setPartialResult('')
    Voice.start(locale)
  }

  return {
    isRecording,
    partialResult: `${storedResult} ${partialResult}`,
    results: result,
    startRecord,
    stopRecord,
  }
}
