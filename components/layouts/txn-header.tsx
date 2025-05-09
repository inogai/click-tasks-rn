import * as React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { LinkButton } from '~/components/link-button'

import { BookPlusIcon, PlusIcon } from '~/lib/icons'

export function TxnHeader() {
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className={`
        flex-row items-center justify-between border-b border-border p-4
      `}
    >
      <View className="flex-1 basis-0 flex-row justify-end gap-2">
        <LinkButton href="/txn/account-create"><BookPlusIcon /></LinkButton>
        <LinkButton href="/txn/create"><PlusIcon /></LinkButton>
      </View>
    </SafeAreaView>
  )
}
