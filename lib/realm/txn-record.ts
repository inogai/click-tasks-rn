import { Realm } from '@realm/react'
import { BSON } from 'realm'
import { z } from 'zod'

import { TxnAccount } from './txn-account'

const zodSchema = z.object({
  accountId: z.string().nonempty(),
  amount: z.string()
    .nonempty()
    .regex(/^[+-]?\d+(\.\d{1,2})?$/, 'Must be a valid decimal number'),
  // ensure is a decimal with (at most) 2 digits

  date: z.coerce.date(),
  summary: z.string().nonempty(),
})

export type ITxnRecord = z.infer<typeof zodSchema>

export class TxnRecord extends Realm.Object<TxnRecord> {
  _id!: Realm.BSON.ObjectId
  created!: Date
  updated!: Date

  account!: TxnAccount
  amount!: Realm.BSON.Decimal128
  date!: Date
  summary!: string
  // TODO: we will add this later
  // category!: TransactionCategory

  static schema: Realm.ObjectSchema = {
    name: 'TxnRecord',
    primaryKey: '_id',
    properties: {
      // generated fields
      _id: 'objectId',
      created: 'date',
      updated: 'date',

      // key fields
      account: 'TxnAccount',
      amount: 'decimal128',
      date: 'date',
      summary: 'string',
    },
  }

  static zodSchema = zodSchema

  static create(props: ITxnRecord, realm: Realm) {
    const now = new Date()
    const account = realm.objectForPrimaryKey(TxnAccount, new BSON.ObjectId(props.accountId)) ?? undefined

    return {
      ...props,
      _id: new Realm.BSON.ObjectId(),
      created: now,
      updated: now,
      amount: new Realm.BSON.Decimal128(props.amount),
      account,
    }
  }

  update(props: Partial<ITxnRecord>, realm: Realm) {
    Object.assign(this, {
      ...props,
      updated: new Date(),
      amount: props.amount && new Realm.BSON.Decimal128(props.amount),
      account: (props.accountId && realm.objectForPrimaryKey(TxnAccount, new BSON.ObjectId(props.accountId))) ?? undefined,
    })
  }

  toFormValues(): ITxnRecord {
    return {
      accountId: this.account?._id?.toString(),
      amount: this.amount.toString(),
      date: this.date,
      summary: this.summary,
    }
  }
}
