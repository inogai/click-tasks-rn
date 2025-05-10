import type { ButtonProps } from '~/components/ui/button'

import { useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Text } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { MicIcon, SquareIcon } from '~/lib/icons'
import { useVoiceRecognition } from '~/lib/use-voice-recognition'
import { cn } from '~/lib/utils'

export interface VoiceButtonProps extends ButtonProps {
  containerClass?: string
  triggerClass?: string
  iconClass?: string
  onAccept?: (result: string) => void
}

export function VoiceButton({
  containerClass,
  triggerClass,
  iconClass: iconClassProp,
  onAccept: onAcceptProp,
  ...buttonProps
}: VoiceButtonProps) {
  const [open, setOpen] = useState(false)

  const {
    isRecording,
    startRecord,
    stopRecord,
    partialResult,
  } = useVoiceRecognition()

  function handleOpenChange(open: boolean) {
    setOpen(open)

    if (open) {
      startRecord()
    }
    else {
      stopRecord()
    }
  }

  function handleCancel() {
    stopRecord()
    setOpen(false)
  }

  function handleAccept() {
    stopRecord()
    setOpen(false)
    onAcceptProp?.(partialResult)
  }

  const iconClassname = cn(
    'text-primary-foreground',
    iconClassProp,
  )

  return (
    <Dialog className={containerClass} open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          {...buttonProps}
          className={cn('grow', triggerClass)}
        >
          {isRecording
            ? <SquareIcon className={iconClassname} />
            : <MicIcon className={iconClassname} />}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-screen-safe h-[700px] w-96"
      >
        <DialogHeader>
          <DialogTitle>{t('voice_button.title')}</DialogTitle>
        </DialogHeader>

        <View className="grow">
          <Text className="text-sm">{partialResult}</Text>
        </View>

        <DialogFooter className="flex-row items-end justify-between">
          <Button
            variant="destructive"
            onPress={handleCancel}
          >
            <Text>{t('voice_button.cancel')}</Text>
          </Button>

          <Button
            className="-mb-2 h-16 w-16 rounded-full"
            size="icon"
            variant="default"
            onPress={isRecording ? stopRecord : startRecord}
          >
            {isRecording
              ? <SquareIcon className="text-primary-foreground" />
              : <MicIcon className="text-primary-foreground" />}
          </Button>

          <Button
            variant="secondary"
            onPress={handleAccept}
          >
            <Text>{t('voice_button.accept')}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
