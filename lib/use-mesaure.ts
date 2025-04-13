import type { ViewRef } from '@rn-primitives/types'
import type { RefObject } from 'react'

import { useLayoutEffect, useState } from 'react'

interface Measure {
  x: number
  y: number
  width: number
  height: number
}

/**
 * A utility hook to measure the dimensions of a View.
 */
export function useMeasure(
  ref: RefObject<ViewRef>,
  defaultValues: Partial<Measure> = {},
) {
  const [measure, setMeasure] = useState<Measure>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    ...defaultValues,
  })

  useLayoutEffect(() => {
    ref.current?.measure((x, y, w, h) => {
      setMeasure({ x, y, width: w, height: h })
    })
  }, [ref])

  return measure
}
