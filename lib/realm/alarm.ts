import { Realm } from '@realm/react'
import { addSeconds, differenceInMilliseconds } from 'date-fns'

import { clearAlarm, setAlarm } from '~/lib/alarm'
import { usePreferenceStore } from '~/lib/preference'
import { formatTimeDeltaLeft, R } from '~/lib/utils'

import { TaskRecord } from './task-record'

export class Alarm extends Realm.Object<Alarm> {
  _id!: Realm.BSON.ObjectId

  title!: string
  time!: Date
  plannedBegin!: Date
  alarmIds!: Realm.List<string>
  task!: Realm.List<TaskRecord>

  static schema: Realm.ObjectSchema = {
    name: 'Alarm',
    primaryKey: '_id',

    properties: {
      _id: 'objectId',

      title: 'string',
      time: 'date',
      plannedBegin: 'date',
      alarmIds: 'string[]',

      task: {
        type: 'linkingObjects',
        objectType: 'Task',
        property: 'alarms',
      },
    },
  }

  delete(realm: Realm) {
    this.alarmIds?.forEach((id) => {
      clearAlarm(id)
    })
    realm.delete(this)
  }

  static onAttach(realm: Realm) {
    const taskRecords = realm.objects(TaskRecord)
    const alarms = realm.objects(Alarm)

    alarms.addListener((collection, changes) => {
      changes.insertions.forEach((index) => {
        const alarm = collection[index]

        setupAlarm(alarm).then((ids) => {
          realm.write(() => {
            alarm.alarmIds.push(...ids)
          })
        })
      })
    })

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

async function setupAlarm(alarm: Alarm) {
  const { time, title, plannedBegin } = alarm

  const alarmType = usePreferenceStore.getState().alarmType

  let alarmIds: string[] = []

  if (alarmType === 'repeat') {
    console.log(`Alarm: creating repeat alarm for task ${title} at ${time}`)
    for (const i of R.range(0, 60)) {
      const date = addSeconds(time, i * 5)
      // we intentionally run await in a loop
      // some android device don't like it when we set multiple alarms at once
      alarmIds.push(await setAlarm(
        title,
        plannedBegin ? formatTimeDeltaLeft(differenceInMilliseconds(plannedBegin, date)) : '',
        date,
      ))
    }
  }
  else {
    alarmIds = [await setAlarm(
      title,
      plannedBegin ? formatTimeDeltaLeft(differenceInMilliseconds(plannedBegin, time)) : '',
      time,
    )]
  }

  return alarmIds
}
