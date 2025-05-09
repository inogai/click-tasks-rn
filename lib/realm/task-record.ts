import { Realm } from '@realm/react'
import { z } from 'zod'

import { clearAlarm, setAlarm } from '~/lib/alarm'
import { t } from '~/lib/i18n'

import { getTaskStatusLabel, TaskStatus } from './lib'

const zodSchema = z.object({
  summary: z.string().nonempty().describe('The summary of the task'),
  status: z.nativeEnum(TaskStatus)
    .describe('1 for PENDING, 2 for COMPLETED, 3 for OVERDUELY_COMPLETED, 4 for DELETED'),

  venue: z.string().optional().nullable().describe('The venue of the task'),
  plannedBegin: z.coerce.date().optional().nullable().describe('Due of task, or activity start date'),
  plannedEnd: z.coerce.date().optional().nullable().describe('null for task, or activity end date'),

  addToCountdown: z.coerce.boolean().describe('don\'t modify this'),
}).superRefine((val, ctx) => {
  // plannedEnd requires plannedBegin
  if ((!val.plannedBegin && val.plannedEnd)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Planned begin and end dates must be both defined or both undefined',
      path: ['plannedEnd'],
    })
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Planned end date must be after planned begin date',
      path: ['plannedBegin'],
    })
  }

  // Ensure plannedBegin is before plannedEnd when both are defined
  if (val.plannedBegin && val.plannedEnd && val.plannedBegin > val.plannedEnd) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Planned end date must be after planned begin date',
      path: ['plannedEnd'],
    })
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Planned end date must be after planned begin date',
      path: ['plannedBegin'],
    })
  }

  if (val.addToCountdown && !val.plannedBegin) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('task_form.add_to_countdown.error.no_due'),
      path: ['plannedBegin'],
    })
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('task_form.add_to_countdown.error.no_due'),
      path: ['addToCountdown'],
    })
  }
})

export type ITaskRecord = z.infer<typeof zodSchema>

export class TaskRecord extends Realm.Object<TaskRecord> {
  _id!: Realm.BSON.ObjectId
  created!: Date
  updated!: Date

  summary!: string
  status!: TaskStatus

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
      venue: { type: 'string', optional: true },
      plannedBegin: { type: 'date', optional: true },
      plannedEnd: { type: 'date', optional: true },
    },
  }

  static zodSchema = zodSchema

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

  toModel(): string {
    if (this.status === TaskStatus.DELETED) {
      return ''
    }

    const content = Object.entries({
      summary: this.summary,
      venue: this.venue,
      status: getTaskStatusLabel(this.status),
      ...this.plannedEnd
        ? {
            plannedBegin: this.plannedBegin?.toLocaleString(),
            plannedEnd: this.plannedEnd?.toLocaleString(),
          }
        : { due: this.plannedBegin?.toLocaleString() },
    })
      .map(([key, value]) => `  <${key}>${value}</${key}>`)
      .join('\n')

    return `<task>
${content}
</task>`
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

  static onAttach(realm: Realm) {
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
}
