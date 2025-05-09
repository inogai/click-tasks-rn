import { RealmProvider as NativeRealmProvider } from '@realm/react'

import { Alarm, TaskRecord, TxnAccount, TxnRecord } from '~/lib/realm'

export function RealmProvider({ children }: { children: React.ReactNode }) {
  return (
    <NativeRealmProvider
      schemaVersion={6}
      schema={[
        TaskRecord,
        TxnAccount,
        TxnRecord,
        Alarm,
      ]}
    >
      {children}
    </NativeRealmProvider>
  )
}
