import { addMilliseconds } from 'date-fns'
import * as R from 'remeda'

import { TimeDelta } from './TimeDelta'

export function dateRange(
  start: Date,
  end: Date,
  step: TimeDelta = TimeDelta.MINUTE(1),
) {
  if (step === 0) {
    throw new RangeError('step should be the same sign as end - start')
  }

  const diffMS = end.getTime() - start.getTime()

  if (diffMS * step < 0) { // if step is not the same sign as diffMS
    throw new RangeError('step should be the same sign as end - start')
  }

  const numSteps = Math.ceil(diffMS / step)

  return R.range(0, numSteps).map(i =>
    addMilliseconds(start, i * step),
  )
}
