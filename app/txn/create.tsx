import type { ITxnRecord } from '~/lib/realm'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRealm } from '@realm/react'
import { router } from 'expo-router'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { TxnForm, useTxnForm } from '~/components/txn-form'

import { TxnRecord } from '~/lib/realm'

export default function TxnCreateScreen() {
  const realm = useRealm()

  const form = useTxnForm()

  function handleSubmit(data: ITxnRecord) {
    realm.write(() => {
      TxnRecord.create(data, realm)
    })

    router.back()
  }

  return (
    <SafeAreaView
      edges={['left', 'right']}
    >
      <View className="h-full px-4 pt-4">
        <TxnForm
          {...form}
          onSubmit={handleSubmit}
        />
      </View>
    </SafeAreaView>
  )
}
