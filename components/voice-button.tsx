import type { UseVoiceRecognitionReturn } from '~/lib/voice'

import { t } from 'i18next'
import { MicIcon, SquareIcon } from 'lucide-nativewind'

import { Button } from '~/components/ui/button'
import { Text, View } from '~/components/ui/text'

import { cn } from '~/lib/utils'

export type VoiceButtonProps = UseVoiceRecognitionReturn & {
  className?: string
  iconClass?: string
}

export function VoiceButton({
  isRecording,
  record,
  className,
  iconClass: iconClassProp,
}: VoiceButtonProps) {
  const iconClassname = cn(
    'text-primary-foreground',
    iconClassProp,
  )

  return (
    <Button
      variant="default"
      size="icon"
      className={cn(className)}
      onPress={() => { record() }}
    >
      {isRecording
        ? <SquareIcon className={iconClassname} />
        : <MicIcon className={iconClassname} />}
    </Button>
  )
}
