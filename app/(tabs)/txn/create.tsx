import type { ITxnRecord } from '~/lib/realm'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRealm } from '@realm/react'
import { router } from 'expo-router'
import { useForm } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BSON } from 'realm'

import { TxnForm } from '~/components/txn-form'
import { View } from '~/components/ui/text'

import { TxnAccount, TxnRecord } from '~/lib/realm'

export default function TxnCreateScreen() {
  const realm = useRealm()

  const form = useForm({
    resolver: zodResolver(TxnRecord.zodSchema),
    mode: 'onChange',
  })

  function handleSubmit(data: ITxnRecord) {
    const record = TxnRecord.create(data, realm)
    console.log('record', record)

    realm.write(() => {
      realm.create(TxnRecord, record)
    })

    router.back()
  }

  return (
    <SafeAreaView
      edges={['left', 'right']}
    >
      <View className="h-full px-4 pt-4">
        <TxnForm
          form={form}
          onSubmit={handleSubmit}
        />
      </View>
    </SafeAreaView>
  )
}
