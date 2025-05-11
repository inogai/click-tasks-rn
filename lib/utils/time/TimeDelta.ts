/** Tagged type for milliseconds */
export type TimeDelta = number & { __tag: 'TimeDelta' }

// eslint-disable-next-line ts/no-redeclare
export const TimeDelta = {
  DAY: (n: number) => n * 24 * 60 * 60 * 1000 as TimeDelta,
  HOUR: (n: number) => n * 60 * 60 * 1000 as TimeDelta,
  MINUTE: (n: number) => n * 60 * 1000 as TimeDelta,
  SECONDS: (n: number) => n * 1000 as TimeDelta,
  MILLISECONDS: (n: number) => n as TimeDelta,
} as const
