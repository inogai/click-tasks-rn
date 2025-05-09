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
  alarm: z.number().describe('ms before'),
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
    alarm: alarmMs,
    ...props
  }: ITaskRecord, realm: Realm) {
    const now = new Date()

    const alarm = realm.create('Alarm', {
      _id: new Realm.BSON.ObjectId(),
      title: props.summary,
      time: addMilliseconds(props.plannedBegin!, alarmMs),
    })

    return realm.create(TaskRecord, {
      ...props,
      _id: new Realm.BSON.ObjectId(),
      created: now,
      updated: now,
      alarms: [alarm],
    })
  }

  update({
    alarm: alarmMs,
    ...props
  }: Partial<ITaskRecord>, realm: Realm) {
    this.updated = new Date()

    this.alarms.forEach((alarm) => { alarm.delete(realm) })
    this.alarms = [] as unknown as Realm.List<Alarm>

    if (alarmMs && this.plannedBegin) {
      const alarm = realm.create('Alarm', {
        _id: new Realm.BSON.ObjectId(),
        title: this.summary,
        time: addMilliseconds(this.plannedBegin, alarmMs),
      }) as unknown as Alarm

      this.alarms.push(alarm)
    }

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
}
