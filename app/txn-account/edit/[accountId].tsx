import type { ITxnAccount } from '~/lib/realm'

import { useObject, useRealm } from '@realm/react'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BSON } from 'realm'

import { TxnAccountForm, useTxnAccountForm } from '~/components/txn-account-form'
import { Button } from '~/components/ui/button'
import { Text, View } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { TrashIcon } from '~/lib/icons'
import { TxnAccount } from '~/lib/realm'

function TxnAccountCreateScreen() {
  const form = useTxnAccountForm()
  const realm = useRealm()
  const router = useRouter()

  const { accountId } = useLocalSearchParams<'/txn-account/edit/[accountId]'>()
  const account = useObject({
    type: TxnAccount,
    primaryKey: new BSON.ObjectId(accountId),
  })

  useFocusEffect(useCallback(() => {
    if (!account) {
      router.replace('/+not-found')
      return
    }

    form.reset(account?.toFormValues() ?? {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]))

  function handleSubmit(data: ITxnAccount) {
    realm.write(() => {
      if (!account) {
        router.replace('/+not-found')
        return
      }

      account.update(data)
    })

    router.back()
  }

  function handleDelete() {
    // TODO: may be we want to prompt user for confirmation
    // also handle the case when this account is used in a transaction
    realm.write(() => {
      realm.delete(account)
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

        <Button
          className="mt-4 flex-row gap-2"
          variant="destructive"
          onPress={handleDelete}
        >
          <TrashIcon />
          <Text>{t('button.delete')}</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default TxnAccountCreateScreen
