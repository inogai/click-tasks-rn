import type { ITaskRecord } from '~/lib/realm'

import { useEffect, useState } from 'react'

import { TaskForm, useTaskForm } from '~/components/task-form'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'

import { CalendarIcon, ClockIcon, MapPinIcon, PencilIcon } from '~/lib/icons'
import { smartFormatDate, smartFormatDateRange } from '~/lib/utils'

import { BaseCard } from './base'

export interface TaskCardProps {
  task: ITaskRecord
  onEdit: (task: ITaskRecord) => void
}

export function TaskCard({
  task,
  onEdit,
}: TaskCardProps) {
  const {
    plannedBegin,
    plannedEnd,
    summary,
    venue,
  } = task

  const [editDialog, setEditDialog] = useState(false)
  const editForm = useTaskForm()

  useEffect(() => {
    editForm.reset({ ...task })
  }, [editDialog])

  function handleEditSubmit(data: ITaskRecord) {
    setEditDialog(false)
    onEdit(data)
  }

  return (
    <BaseCard
      title={summary}
      titleTag="Task"
      type="task"
      lines={[
        plannedBegin && !plannedEnd && [ClockIcon, smartFormatDate(plannedBegin)],
        plannedBegin && plannedEnd && [CalendarIcon, smartFormatDateRange(plannedEnd, plannedBegin)],
        venue && [MapPinIcon, venue],
      ]}
      renderRightBtn={({ className, iconClass }) => (
        <Dialog className={className} open={editDialog} onOpenChange={setEditDialog}>
          <DialogTrigger asChild>
            <Button className="w-full flex-1 rounded-none" size="icon" variant="default">
              <PencilIcon className={iconClass} />
            </Button>
          </DialogTrigger>
          <DialogContent className="h-screen-safe justify-center">
            <TaskForm form={editForm} onSubmit={handleEditSubmit} />
          </DialogContent>
        </Dialog>
      )}
    />
  )
}
