import type { SpeechResultsEvent } from '@react-native-voice/voice'

import Voice from '@react-native-voice/voice'
import { useEffect, useState } from 'react'

export interface UseVoiceRecognitionOpts {
  onSpeechResults: (e: SpeechResultsEvent) => void
}

export interface UseVoiceRecognitionReturn {
  isRecording: boolean
  record: () => void
}

export function useVoiceRecognition({
  onSpeechResults: onSpeechResultsProps,
}: UseVoiceRecognitionOpts) {
  const [isRecording, setIsRecording] = useState(false)
  const [partialResult, setPartialResult] = useState('')

  // ensurePermission()

  async function record() {
    if (isRecording) {
      const b = await Voice.stop()
    }
    else {
      setIsRecording(true)
      Voice.start('zh-HK')
      setPartialResult('')
    }
  }

  useEffect(() => {
    (async () => {
      // TODO: prompt user to install the Google Speech Recognition if not found
      // TODO: prompt user to give permission to Google Speech Recognition
      const ok = await Voice.getSpeechRecognitionServices()
    })()

    Voice.onSpeechStart = (e) => {
      if (e.error) {
        console.error('onSpeechStart', e.error)
      }
    }

    Voice.onSpeechEnd = (e) => {
      setIsRecording(false)
      if (e.error) {
        console.error('onSpeechEnd', e.error)
      }
    }

    Voice.onSpeechError = (e) => {
      setIsRecording(false)
      if (e.error) {
        console.error('onSpeechError', e.error)
      }
    }

    Voice.onSpeechPartialResults = (e) => {
      if (e.value) {
        setPartialResult(e.value[0])
        console.log('onSpeechPartialResults', e.value[0])
      }
    }

    Voice.onSpeechResults = (e) => {
      console.log('onSpeechResults', e)
      onSpeechResultsProps(e)
    }
  }, [])

  return {
    isRecording,
    record,
    partialResult,
  }
}
