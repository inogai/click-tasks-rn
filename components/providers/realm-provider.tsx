import { RealmProvider as NativeRealmProvider } from '@realm/react'

import { Countdown, TaskRecord, TxnAccount, TxnRecord } from '~/lib/realm'

export function RealmProvider({ children }: { children: React.ReactNode }) {
  return (
    <NativeRealmProvider
      schemaVersion={2}
      schema={[
        TaskRecord,
        TxnAccount,
        TxnRecord,
        Countdown,
      ]}
    >
      {children}
    </NativeRealmProvider>
  )
}
