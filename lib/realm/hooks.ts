import { useRealm } from '@realm/react'
import { useEffect } from 'react'

import { clearAlarm, setAlarm } from '~/lib/alarm'

import { TaskStatus } from './lib'
import { TaskRecord } from './schema'

async function setupAlarm(task: TaskRecord) {
  console.log('setupAlarm', task)

  if (task.alarmId) {
    try {
      await clearAlarm(task.alarmId)
    }
    catch {}
  }

  if (task.status === TaskStatus.COMPLETED) {
    return
  }

  if (task.plannedBegin) {
    const alarmId = await setAlarm(
      'Alarm',
      task.summary,
      task.plannedBegin,
    )

    task.alarmId = alarmId
  }
}

function attachListeners(realm: Realm) {
  const objects = realm.objects(TaskRecord)

  objects.addListener((collection, changes) => {
    // changes.deletions.forEach((index) => {
    // })

    changes.newModifications.forEach((index) => {
      const task = collection[index]
      setupAlarm(task)
    })

    changes.insertions.forEach((index) => {
      const task = collection[index]
      setupAlarm(task)
    })
  })
}

let attached = false

export function useTaskRecordListeners() {
  const realm = useRealm()

  useEffect(() => {
    if (attached)
      return

    attachListeners(realm)
    attached = true
  }, [realm])
}
