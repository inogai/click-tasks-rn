import type { VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react-native'
import type { ReactNode } from 'react'

import { cva } from 'class-variance-authority'

import { Card, CardTitle } from '~/components/ui/card'
import { Text, View } from '~/components/ui/text'

const cardVariant = cva(
  'flex-row items-stretch overflow-hidden rounded-md border-l-4',
  {
    variants: {
      type: {
        task: 'border-l-blue-500',
        txn: 'border-l-green-500',
      },
    },
  },
)

const tagsVariant = cva(
  'rounded-full px-2 py-0.5 text-sm font-semibold',
  {
    variants: {
      type: {
        task: 'bg-blue-100 text-blue-800',
        txn: 'bg-green-100 text-green-800',
      },
    },
  },
)

export type CardLine = [LucideIcon, string]

export interface BaseCardProps extends VariantProps<typeof cardVariant> {
  title: string
  titleTag: string
  lines: (CardLine | '' | null | undefined)[]
  renderRightBtn?: (props: { className?: string, iconClass?: string }) => ReactNode
}

export function BaseCard({
  title,
  titleTag,
  lines,
  renderRightBtn,
  ...props
}: BaseCardProps) {
  return (
    <Card className={cardVariant(props)}>
      <View className="flex-1 p-4 pr-0">
        <View className="mb-2 flex-row items-center gap-4">
          <CardTitle className="pt-1">{title}</CardTitle>
          <Text className={tagsVariant(props)}>{titleTag}</Text>
        </View>

        <View className="gap-1">
          {lines
            .filter(line => !!line)
            .map(([IconComp, text]) => (
              <View className="flex-row items-center gap-1" key={text}>
                <IconComp className="h-5 text-muted-foreground" />
                <Text className="text-sm text-muted-foreground">{text}</Text>
              </View>
            ))}
        </View>
      </View>

      {renderRightBtn && renderRightBtn({
        className: 'h-auto w-12',
        iconClass: 'h-5 w-5',
      })}
    </Card>
  )
}
