import type { ClassValue } from 'clsx'

import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Perform merge and conditioning of class names
 * By @shadcn/ui
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
