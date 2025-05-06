import { Text } from '~/components/ui/text'

import { cn } from '~/lib/utils'

export function AppLogo({
  className,
}: {
  className?: string
}) {
  return (
    <Text
      // should not voice out the logo
      accessible={false}
      className={cn('text-3xl font-extrabold text-[#75ca00]', className)}
    // eslint-disable-next-line i18next/no-literal-string
    >
      Better
    </Text>
  )
}
