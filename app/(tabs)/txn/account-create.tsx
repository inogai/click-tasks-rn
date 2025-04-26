import type { ITxnAccount } from '~/lib/realm'

import { useRealm } from '@realm/react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { TxnAccountForm, useTxnAccountForm } from '~/components/txn-account-form'
import { View } from '~/components/ui/text'

import { TxnAccount } from '~/lib/realm'

function TxnAccountCreateScreen() {
  const form = useTxnAccountForm()
  const realm = useRealm()
  const router = useRouter()

  function handleSubmit(data: ITxnAccount) {
    realm.write(() => {
      realm.create(TxnAccount, TxnAccount.create(data))
    })

    router.back()
  }

  return (
    <SafeAreaView
      edges={['left', 'right']}
    >
      <View className="px-4 pt-4">
        <TxnAccountForm
          form={form}
          onSubmit={handleSubmit}
        />
      </View>
    </SafeAreaView>
  )
}

export default TxnAccountCreateScreen
