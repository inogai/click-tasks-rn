import type { TaskCardProps } from '~/components/recognize-card/task'
import type { TxnCardProps } from '~/components/recognize-card/txn'

import { TaskCard } from '~/components/recognize-card/task'
import { TxnCard } from '~/components/recognize-card/txn'

type RecognizeCardProps =
  | ({ type: 'txn' } & TxnCardProps)
  | ({ type: 'task' } & TaskCardProps)

export function RecognizeCard(props: RecognizeCardProps) {
  switch (props.type) {
    case 'task':
      return <TaskCard {...props} />
    case 'txn':
      return <TxnCard {...props} />
    default:
      return null
  }
}
