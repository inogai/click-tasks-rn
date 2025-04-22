import { MicIcon, SquareIcon } from 'lucide-nativewind'
import { useState } from 'react'
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
import { Text, View } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { cn } from '~/lib/utils'
import { useVoiceRecognition } from '~/lib/voice'

export interface VoiceButtonProps {
  className?: string
  iconClass?: string
  onAccept?: (result: string) => void
}

export function VoiceButton({
  className,
  iconClass: iconClassProp,
  onAccept: onAcceptProp,
}: VoiceButtonProps) {
  const [open, setOpen] = useState(false)

  const {
    isRecording,
    startRecord,
    stopRecord,
    partialResult,
    results,
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

  const contentInsets = useSafeAreaInsets()

  const iconClassname = cn(
    'text-primary-foreground',
    iconClassProp,
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} className="flex-1">
      <DialogTrigger asChild>
        <Button
          variant="default"
          className={cn('grow', className)}
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
            variant="default"
            size="icon"
            className="-mb-2 h-16 w-16 rounded-full"
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
