import type { TxnRecord } from './txn-record'

import { Realm } from '@realm/react'
import { z } from 'zod'

const zodSchema = z.object({
  name: z.string().nonempty(),
  currency: z.string().length(3),
})

export type ITxnAccount = z.infer<typeof zodSchema>

export class TxnAccount extends Realm.Object<TxnAccount> {
  _id!: Realm.BSON.ObjectId
  created!: Date
  updated!: Date

  name!: string
  currency!: string
  txns!: Realm.List<TxnRecord>

  static schema: Realm.ObjectSchema = {
    name: 'TxnAccount',
    primaryKey: '_id',
    properties: {
      // generated fields
      _id: 'objectId',
      created: 'date',
      updated: 'date',

      // key fields
      name: 'string',
      currency: 'string',

      txns: {
        type: 'linkingObjects',
        objectType: 'TxnRecord',
        property: 'account',
      },
    },
  }

  static zodSchema = zodSchema

  static create(props: ITxnAccount) {
    const now = new Date()

    return {
      ...props,
      _id: new Realm.BSON.ObjectId(),
      created: now,
      updated: now,
    }
  }

  update(props: Partial<ITxnAccount>) {
    Object.assign(this, {
      ...props,
      updated: new Date(),
    })
  }

  toFormValues(): ITxnAccount {
    return {
      name: this.name,
      currency: this.currency,
    }
  }

  static onAttach(realm: Realm) {
    if (realm.objects(TxnAccount).length === 0) {
      realm.write(() => {
        realm.create(TxnAccount, TxnAccount.create({ name: 'Cash', currency: 'USD' }))
        realm.create(TxnAccount, TxnAccount.create({ name: 'Bank', currency: 'USD' }))
      })
    }
  }
}
