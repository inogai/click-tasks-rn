import { RealmProvider as NativeRealmProvider } from '@realm/react'
import { TaskRecord } from '~/lib/realm'

export function RealmProvider({ children }: { children: React.ReactNode }) {
  return <NativeRealmProvider schema={[TaskRecord]}>{children}</NativeRealmProvider>
}
