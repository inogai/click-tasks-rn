import { Realm } from '@realm/react'
import { z } from 'zod'

export enum TaskStatus {
  PENDING = 0,
  COMPLETED = 1,
}

export interface SystemFields {
  _id: Realm.BSON.ObjectId
  created: Date
  updated: Date
}

export const taskZod = z.object({
  summary: z.string().nonempty(),
  status: z.nativeEnum(TaskStatus),

  due: z.date().optional(),
  venue: z.string().optional(),
})

export type ITaskRecord = z.infer<typeof taskZod>

export class TaskRecord extends Realm.Object<TaskRecord> {
  _id!: Realm.BSON.ObjectId
  created!: Date
  updated!: Date

  summary!: string
  status!: TaskStatus

  due!: Date | null
  venue!: string | null

  static create(props: ITaskRecord) {
    const now = new Date()

    return {
      ...props,
      _id: new Realm.BSON.ObjectId(),
      created: now,
      updated: now,
    }
  }

  static update(_id: Realm.BSON.ObjectId, props: Partial<ITaskRecord>) {
    return {
      ...props,
      _id,
      updated: new Date(),
    }
  }

  static schema: Realm.ObjectSchema = {
    name: 'Task',
    primaryKey: '_id',
    properties: {
      // generated fields
      _id: 'objectId',
      created: 'date',
      updated: 'date',

      // key fields
      summary: 'string',
      status: 'int',

      // optional fields
      due: { type: 'date', optional: true },
      venue: { type: 'string', optional: true },
    },
  }
}
