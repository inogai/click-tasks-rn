import type { icons, LucideIcon, LucideProps } from 'lucide-react-native'

import { Realm } from '@realm/react'
import { icons as lucideIcons } from 'lucide-react-native'
import { z } from 'zod'

const zodSchema = z.object({
  name: z.string().nonempty(),
  color: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  icon: z.string(),
  isDefault: z.boolean().optional(),
})

export type ITxnCat = z.infer<typeof zodSchema> & {
  icon: keyof typeof icons
}

export class TxnCat extends Realm.Object<TxnCat> {
  _id!: Realm.BSON.ObjectId
  created!: Date
  updated!: Date

  name!: string
  color!: string
  icon!: string
  isDefault!: boolean

  static schema: Realm.ObjectSchema = {
    name: 'TxnCat',
    primaryKey: '_id',
    properties: {
      // generated fields
      _id: 'objectId',
      created: 'date',
      updated: 'date',

      // key fields
      name: 'string',
      color: 'string',
      icon: 'string',
      isDefault: 'bool',
    },
  }

  static zodSchema = zodSchema

  static create(props: ITxnCat, realm: Realm) {
    const now = new Date()

    return realm.create<TxnCat>(TxnCat, {
      isDefault: false,
      ...props,
      _id: new Realm.BSON.ObjectId(),
      created: now,
      updated: now,
    })
  }

  update({
    isDefault = false,
    ...props
  }: Partial<ITxnCat>, realm: Realm) {
    Object.assign(this, {
      ...props,
      updated: new Date(),
    })

    if (isDefault && !this.isDefault) {
      const allCats = realm.objects(TxnCat).filtered('isDefault == true')
      allCats.forEach(cat => cat.isDefault = false)
      this.isDefault = true
    }
  }

  static delete(cat: TxnCat, realm: Realm) {
    if (cat.isDefault) {
      throw new Error('Cannot delete default category')
    }
  }

  renderIcon(props?: LucideProps) {
    // @ts-expect-error we know that it is either a icon or undefined
    const IconComp: LucideIcon = lucideIcons[this.icon ?? ''] ?? lucideIcons.SquareDashed
    return <IconComp color={this.color} {...props} />
  }

  static onAttach(realm: Realm) {
    const txnCats = realm.objects(TxnCat)

    if (txnCats.length === 0) {
      const defaultTxnCats: ITxnCat[] = [
        { name: 'Default', color: '#000000', icon: 'Circle', isDefault: true },
        { name: 'Food', color: '#FF0000', icon: 'Apple' },
        { name: 'Transport', color: '#00FF00', icon: 'Car' },
        { name: 'Entertainment', color: '#0000FF', icon: 'Music' },
      ]

      realm.write(() => {
        defaultTxnCats.forEach(cat => TxnCat.create(cat, realm))
      })
    }
  }
}
