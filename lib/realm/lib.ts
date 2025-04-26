import type Realm from 'realm'

export enum TaskStatus {
  PENDING = 1,
  COMPLETED = 2,
}

export interface SystemFields {
  _id: Realm.BSON.ObjectId
  created: Date
  updated: Date
}
