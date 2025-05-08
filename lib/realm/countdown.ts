import type { TaskRecord } from './task-record'

import { Realm } from '@realm/react'

export class Countdown extends Realm.Object<Countdown> {
  _id!: Realm.BSON.ObjectId
  taskRecord!: TaskRecord

  static schema: Realm.ObjectSchema = {
    name: 'Countdown',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      taskRecord: 'Task',
    },
  }

  static create(taskRecord: TaskRecord, realm: Realm) {
    return realm.create(Countdown, {
      _id: new Realm.BSON.ObjectId(),
      taskRecord,
    })
  }

  static deleteByTaskRecord(taskRecord: TaskRecord, realm: Realm) {
    const countdowns = realm
      .objects(Countdown)
      .filtered('taskRecord == $0', taskRecord)

    for (const item of countdowns) {
      realm.delete(item)
    }
  }

  static existsByTaskRecord(taskRecord: TaskRecord, realm: Realm) {
    const countdowns = realm
      .objects(Countdown)
      .filtered('taskRecord == $0', taskRecord)

    return countdowns.length > 0
  }
}
