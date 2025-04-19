import { Realm, useRealm } from '@realm/react'
import { useEffect } from 'react'
import { z } from 'zod'

import { clearAlarm, setAlarm } from '~/lib/alarm'

import { TaskStatus } from './lib'

export const taskZod = z.object({
  summary: z.string().nonempty(),
  status: z.nativeEnum(TaskStatus),

  due: z.date().optional().nullable(),
  venue: z.string().optional().nullable(),
  plannedBegin: z.date().optional().nullable(),
  plannedEnd: z.date().optional().nullable(),
}).superRefine((val, ctx) => {
  // Ensure plannedBegin and plannedEnd are either
  // 1. both defined; or
  // 2. both undefined.
  if ((val.plannedBegin && !val.plannedEnd)
    || (!val.plannedBegin && val.plannedEnd)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Planned begin and end dates must be both defined or both undefined',
      path: ['plannedEnd'],
    })
  }

  // Ensure plannedBegin is before plannedEnd when both are defined
  if (val.plannedBegin && val.plannedEnd && val.plannedBegin > val.plannedEnd) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Planned end date must be after planned begin date',
      path: ['plannedEnd'],
    })
  }
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
  plannedBegin!: Date | null
  plannedEnd!: Date | null
  alarmId!: string | null

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
      plannedBegin: { type: 'date', optional: true },
      plannedEnd: { type: 'date', optional: true },
    },
  }

  static create(props: ITaskRecord) {
    const now = new Date()

    return {
      ...props,
      _id: new Realm.BSON.ObjectId(),
      created: now,
      updated: now,
    }
  }

  update(props: Partial<ITaskRecord>) {
    this.updated = new Date()
    Object.assign(this, props)
  }

  async syncAlarm(this: TaskRecord) {
    if (this.alarmId) {
      try {
        await clearAlarm(this.alarmId)
      }
      catch {}
    }

    if (this.status === TaskStatus.COMPLETED) {
      return
    }

    if (this.plannedBegin) {
      const alarmId = await setAlarm(
        'Alarm',
        this.summary,
        this.plannedBegin,
      )

      this.alarmId = alarmId
    }
  }
}

function attachTaskRecordListeners(realm: Realm) {
  const objects = realm.objects(TaskRecord)

  objects.addListener((collection, changes) => {
    // changes.deletions.forEach((index) => {
    // })

    changes.newModifications.forEach((index) => {
      const task = collection[index]
      task.syncAlarm()
    })

    changes.insertions.forEach((index) => {
      const task = collection[index]
      task.syncAlarm()
    })
  })
}

let attached = false

export function useTaskRecordListeners() {
  const realm = useRealm()

  useEffect(() => {
    if (attached)
      return

    attachTaskRecordListeners(realm)
    attached = true
  }, [realm])
}
