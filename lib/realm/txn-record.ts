import { Realm } from '@realm/react'
import { BSON } from 'realm'
import { z } from 'zod'

import { TxnCat } from '~/lib/realm/txn-cat'

import { TxnAccount } from './txn-account'

const zodSchema = z.object({
  accountId: z.string().nonempty(),
  amount: z.string()
    .nonempty()
    .regex(/^[+-]?\d+(\.\d{1,2})?$/, 'Must be a valid decimal number'),
  // ensure is a decimal with (at most) 2 digits

  catId: z.string().optional(),
  date: z.coerce.date(),
  summary: z.string().nonempty(),
})

export type ITxnRecord = z.infer<typeof zodSchema>

export class TxnRecord extends Realm.Object<TxnRecord> {
  _id!: Realm.BSON.ObjectId
  created!: Date
  updated!: Date

  account!: TxnAccount
  cat?: TxnCat

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

      // relationships
      account: 'TxnAccount',
      cat: 'TxnCat?',

      // key fields
      amount: 'decimal128',
      date: 'date',
      summary: 'string',
    },
  }

  static zodSchema = zodSchema

  static create({
    catId,
    accountId,
    ...props
  }: ITxnRecord, realm: Realm) {
    const now = new Date()
    const account = realm.objectForPrimaryKey(TxnAccount, new BSON.ObjectId(accountId)) ?? undefined
    const cat = realm.objectForPrimaryKey(TxnCat, new BSON.ObjectId(catId)) ?? undefined

    return realm.create(TxnRecord, {
      ...props,
      _id: new Realm.BSON.ObjectId(),
      created: now,
      updated: now,

      amount: new Realm.BSON.Decimal128(props.amount),
      account,
      cat,
    })
  }

  update({
    amount,
    accountId,
    catId,
    ...props
  }: Partial<ITxnRecord>, realm: Realm) {
    Object.assign(this, {
      ...props,
      updated: new Date(),
      amount: amount && new Realm.BSON.Decimal128(amount),
      account: (accountId && realm.objectForPrimaryKey(TxnAccount, new BSON.ObjectId(accountId))) ?? undefined,
      cat: (catId && realm.objectForPrimaryKey(TxnCat, new BSON.ObjectId(catId))) ?? undefined,
    })
  }

  toFormValues(): ITxnRecord {
    return {
      accountId: this.account?._id?.toString(),
      catId: this.cat?._id?.toString(),

      amount: this.amount.toString(),
      date: this.date,
      summary: this.summary,
    }
  }

  toModel(): string {
    const content = Object.entries({
      account: this.account?.name,
      cat: this.cat?.name,
      currency: this.account?.currency,
      date: this.date.toLocaleString(),
      summary: this.summary,
    })
      .map(([key, value]) => `  <${key}>${value}</${key}>`)
      .join('\n')

    return `<txn>
${content}
</txn>`
  }
}
