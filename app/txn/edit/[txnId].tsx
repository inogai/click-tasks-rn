import type { ITxnRecord } from '~/lib/realm'

import { useObject, useRealm } from '@realm/react'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BSON } from 'realm'

import { TxnForm, useTxnForm } from '~/components/txn-form'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'

import { t } from '~/lib/i18n'
import { TrashIcon } from '~/lib/icons'
import { TxnRecord } from '~/lib/realm'

export default function TxnEditScreen() {
  const realm = useRealm()

  const { txnId } = useLocalSearchParams<'/txn/edit/[txnId]'>()
  const txnObj = useObject({ type: TxnRecord, primaryKey: new BSON.ObjectId(txnId) })

  const { form, ...rest } = useTxnForm()

  useFocusEffect(useCallback(() => {
    if (!txnObj) {
      router.replace('/+not-found')
      return
    }

    form.reset(txnObj.toFormValues())
    form.trigger()
  }, [txnObj]))

  function handleSubmit(data: ITxnRecord) {
    if (!txnObj) {
      router.replace('/+not-found')
      return
    }

    realm.write(() => {
      txnObj.update(data, realm)
    })

    router.back()
  }

  function handleDelete() {
    if (!txnObj) {
      router.replace('/+not-found')
    }

    realm.write(() => {
      realm.delete(txnObj)
    })

    router.back()
  }

  return (
    <SafeAreaView
      edges={['left', 'right']}
    >
      <View className="px-4 pt-4">
        <TxnForm
          {...rest}
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
