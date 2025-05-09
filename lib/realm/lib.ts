/* eslint-disable i18next/no-literal-string */
import type Realm from 'realm'

export enum TaskStatus {
  PENDING = 1,
  COMPLETED = 2,
  OVERDUE_COMPLETED = 3,
  DELETED = 4,
}

export function getTaskStatusLabel(status: TaskStatus) {
  switch (status) {
    case TaskStatus.PENDING:
      return 'Pending'
    case TaskStatus.COMPLETED:
      return 'Completed'
    case TaskStatus.OVERDUE_COMPLETED:
      return 'Overdue Completed'
    case TaskStatus.DELETED:
      return 'Deleted'
    default:
      return 'Unknown'
  }
}

export interface SystemFields {
  _id: Realm.BSON.ObjectId
  created: Date
  updated: Date
}
