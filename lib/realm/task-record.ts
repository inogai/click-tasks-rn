import type { Alarm } from './alarm'

import { Realm } from '@realm/react'
import { addMilliseconds } from 'date-fns'
import { z } from 'zod'

import { t } from '~/lib/i18n'

import { getTaskStatusLabel, TaskStatus } from './lib'

const zodSchema = z.object({
  summary: z.string().nonempty().describe('The summary of the task'),
  status: z.nativeEnum(TaskStatus)
    .describe('1 for PENDING, 2 for COMPLETED, 3 for OVERDUELY_COMPLETED, 4 for DELETED'),

  venue: z.string().optional().nullable().describe('The venue of the task'),
  plannedBegin: z.coerce.date().optional().nullable().describe('Due of task, or activity start date'),
  plannedEnd: z.coerce.date().optional().nullable().describe('null for task, or activity end date'),

  countdown: z.coerce.boolean().describe('whether to add to countdown'),
  alarms: z.array(z.number().positive()).describe('how many ms before the plannedBegin to trigger alarm'),
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

  if (val.countdown && !val.plannedBegin) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('task_form.countdown.error.no_due'),
      path: ['plannedBegin'],
    })
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('task_form.countdown.error.no_due'),
      path: ['countdown'],
    })
  }

  if (val.alarms.length > 0 && !val.plannedBegin) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('task_form.alarms.error.no_due'),
      path: ['plannedBegin'],
    })
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('task_form.alarms.error.no_due'),
      path: ['alarms'],
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

  countdown!: boolean
  alarms!: Realm.List<Alarm>

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

      countdown: 'bool',
      alarms: 'Alarm[]',
    },
  }

  static zodSchema = zodSchema

  static create({
    alarms: alarmProps,
    ...props
  }: ITaskRecord, realm: Realm) {
    const now = new Date()

    const alarms = alarmProps.map(alarmMs => realm.create('Alarm', {
      _id: new Realm.BSON.ObjectId(),
      title: props.summary,
      time: addMilliseconds(props.plannedBegin!, alarmMs),
    }))

    return realm.create(TaskRecord, {
      ...props,
      _id: new Realm.BSON.ObjectId(),
      created: now,
      updated: now,
      alarms,
    })
  }

  update({
    alarms: alarmsProp,
    ...props
  }: Partial<ITaskRecord>, realm: Realm) {
    this.updated = new Date()

    if (alarmsProp) {
      this.alarms.forEach((alarm) => {
        alarm.delete(realm)
      })

      this.alarms = alarmsProp?.map(alarmMs => realm.create<Alarm>('Alarm', {
        _id: new Realm.BSON.ObjectId(),
        title: this.summary,
        time: addMilliseconds(this.plannedBegin!, -alarmMs),
      })) satisfies Alarm[] as unknown as Realm.List<Alarm>
    }

    Object.assign(this, props)
  }

  toFormValues(): ITaskRecord {
    return {
      summary: this.summary,
      status: this.status,

      venue: this.venue,
      plannedBegin: this.plannedBegin,
      plannedEnd: this.plannedEnd,

      alarms: this.alarms.map(alarm => this.plannedBegin!.getTime() - alarm.time.getTime()),
      countdown: this.countdown,
    }
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
}
