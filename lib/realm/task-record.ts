import { Realm } from '@realm/react'
import { addSeconds, differenceInMinutes } from 'date-fns'
import { z } from 'zod'

import { clearAlarm, setAlarm } from '~/lib/alarm'
import { t } from '~/lib/i18n'
import { usePreferenceStore } from '~/lib/preference'
import { R } from '~/lib/utils'

import { getTaskStatusLabel, TaskStatus } from './lib'

const zodSchema = z.object({
  summary: z.string().nonempty().describe('The summary of the task'),
  status: z.nativeEnum(TaskStatus)
    .describe('1 for PENDING, 2 for COMPLETED, 3 for OVERDUELY_COMPLETED, 4 for DELETED'),

  venue: z.string().optional().nullable().describe('The venue of the task'),
  plannedBegin: z.coerce.date().optional().nullable().describe('Due of task, or activity start date'),
  plannedEnd: z.coerce.date().optional().nullable().describe('null for task, or activity end date'),

  addToCountdown: z.coerce.boolean().describe('don\'t modify this'),
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

      alarms: {
        type: 'linkingObjects',
        objectType: 'Alarm',
        property: 'task',
      },
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
}

export class Alarm extends Realm.Object<Alarm> {
  _id!: Realm.BSON.ObjectId
  task!: TaskRecord
  time!: Date
  alarmIds!: Realm.List<string>

  static schema: Realm.ObjectSchema = {
    name: 'Alarm',
    primaryKey: '_id',

    properties: {
      _id: 'objectId',
      task: 'Task',
      time: 'date',
      alarmId: 'string[]',
    },
  }

  static async create({
    task,
    time,
  }: {
    task: TaskRecord
    time: Date
  }, realm: Realm) {
    const alarmType = usePreferenceStore.getState().alarmType
    const due = task.plannedBegin

    if (!due)
      throw new Error('Due date is required to set an alarm')

    let alarmIds: string[] = []

    if (alarmType === 'repeat') {
      console.log(`Alarm: creating repeat alarm for task ${task.summary} at ${time}`)
      alarmIds = await Promise.all(R
        .range(0, 60)
        .map(i => addSeconds(time, 5 * i))
        .map(date => setAlarm(
          task.summary,
          t('alarm.notification.minutesLeft', {
            minutes: differenceInMinutes(due, date),
          }),
          time,
        )),
      )
    }
    else {
      alarmIds = [await setAlarm(
        task.summary,
        t('alarm.notification.minutesLeft', {
          minutes: differenceInMinutes(due, time),
        }),
        time,
      )]
    }

    return realm.create(Alarm, { task, time, alarmIds })
  }

  delete(realm: Realm) {
    this.alarmIds.forEach((id) => {
      clearAlarm(id)
    })
    realm.delete(this)
  }

  static onAttach(realm: Realm) {
    const taskRecords = realm.objects(TaskRecord)

    taskRecords.addListener((collection, changes) => {
      // Handle deletions
      changes.deletions.forEach((index) => {
        const deletedTaskId = collection[index]._id

        // Find and delete the associated Alarms
        const alarms = realm.objects(Alarm).filtered('taskRecord._id == $0', deletedTaskId)
        realm.write(() => {
          realm.delete(alarms)
        })
      })
    })
  }
}
