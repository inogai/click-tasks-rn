import { useRealm } from '@realm/react'
import { useEffect } from 'react'

import { TaskRecord } from './task-record'
import { TxnAccount } from './txn-account'
import { TxnRecord } from './txn-record'

const OBJECT_CLASSES = [
  TaskRecord,
  TxnAccount,
  TxnRecord,
]

export function useRealmSideEffects() {
  const realm = useRealm()

  useEffect(() => {
    for (const objectClass of OBJECT_CLASSES) {
      if ('onAttach' in objectClass) {
        objectClass.onAttach(realm)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
