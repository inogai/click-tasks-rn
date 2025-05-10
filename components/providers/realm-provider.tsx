import { RealmProvider as NativeRealmProvider } from '@realm/react'

import { Alarm, TaskRecord, TxnAccount, TxnCat, TxnRecord } from '~/lib/realm'

export function RealmProvider({ children }: { children: React.ReactNode }) {
  return (
    <NativeRealmProvider
      schemaVersion={8}
      schema={[
        TaskRecord,
        TxnAccount,
        TxnRecord,
        TxnCat,
        Alarm,
      ]}
    >
      {children}
    </NativeRealmProvider>
  )
}
