import { RealmProvider as NativeRealmProvider } from '@realm/react'

import { Alarm, Countdown, TaskRecord, TxnAccount, TxnRecord } from '~/lib/realm'

export function RealmProvider({ children }: { children: React.ReactNode }) {
  return (
    <NativeRealmProvider
      schemaVersion={4}
      schema={[
        TaskRecord,
        TxnAccount,
        TxnRecord,
        Countdown,
        Alarm,
      ]}
    >
      {children}
    </NativeRealmProvider>
  )
}
