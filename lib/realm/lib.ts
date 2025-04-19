import type Realm from 'realm'

export enum TaskStatus {
  PENDING = 0,
  COMPLETED = 1,
}

export interface SystemFields {
  _id: Realm.BSON.ObjectId
  created: Date
  updated: Date
}
