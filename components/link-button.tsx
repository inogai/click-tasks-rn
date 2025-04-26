import type { LinkProps } from 'expo-router'

import { Link } from 'expo-router'

import { Button } from '~/components/ui/button'

export function LinkButton({
  href,
  children,
}: {
  href: LinkProps['href']
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      asChild
    >
      <Button size="icon" variant="ghost">
        {children}
      </Button>
    </Link>
  )
}
