import { useQuery, useRealm } from '@realm/react'
import { useInterval } from 'ahooks'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'

import { Alarm } from './alarm'
import { TaskRecord } from './task-record'
import { TxnAccount } from './txn-account'
import { TxnRecord } from './txn-record'

const OBJECT_CLASSES = [
  TaskRecord,
  TxnAccount,
  TxnRecord,
  Alarm,
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

  const [date, setDate] = useState(new Date())

  const alarms = useQuery({
    type: Alarm,
    // query: collection => collection,
    // .filtered('time <= $0', date),
  }, [date])

  useInterval(() => {
    setDate(new Date())
  }, 5000)

  useEffect(() => {
    console.log(alarms, date)
    if (alarms.length > 0) {
      alarms.forEach((alarm) => {
        router.push({
          pathname: '/alarm/[id]',
          params: {
            id: alarm._id.toString(),
          },
        })
      })
    }
  }, [alarms])
}
