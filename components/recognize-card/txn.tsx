import type { ITxnRecord } from '~/lib/realm'

import { useEffect, useState } from 'react'
import { BSON } from 'realm'

import { TxnForm, useTxnForm } from '~/components/txn-form'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'

import { BookIcon, CalendarIcon, CircleDollarSignIcon, PencilIcon } from '~/lib/icons'
import { TxnAccount, useRealmObject } from '~/lib/realm'
import { smartFormatDate } from '~/lib/utils/format-date-range'

import { BaseCard } from './base'

export interface TxnCardProps {
  txn: ITxnRecord
  onEdit: (txn: ITxnRecord) => void
}

export function TxnCard({
  txn,
  onEdit,
}: TxnCardProps) {
  const {
    accountId,
    amount,
    date,
    summary,
  } = txn

  const account = useRealmObject({ type: TxnAccount, primaryKey: new BSON.ObjectId(accountId) })

  const [editDialog, setEditDialog] = useState(false)
  const { form, ...rest } = useTxnForm()

  useEffect(() => {
    form.reset({ ...txn })
  }, [editDialog])

  function handleEditSubmit(data: ITxnRecord) {
    setEditDialog(false)
    onEdit(data)
  }

  if (!account) {
    return (
      <BaseCard
        lines={[[BookIcon, 'Invalid Account']]}
        title={summary}
        titleTag="Txn"
        type="txn"
      />
    )
  }

  return (
    <BaseCard
      title={summary}
      titleTag={Number.parseFloat(amount) > 0 ? 'Income' : 'Expense'}
      type="txn"
      lines={[
        [BookIcon, account.name],
        date && [CalendarIcon, smartFormatDate(date)],
        [CircleDollarSignIcon, `${account.currency} ${amount}`],
      ]}
      renderRightBtn={({ className, iconClass }) => (
        <Dialog className={className} open={editDialog} onOpenChange={setEditDialog}>
          <DialogTrigger asChild>
            <Button className="w-full flex-1 rounded-none" size="icon" variant="default">
              <PencilIcon className={iconClass} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <TxnForm {...rest} form={form} onSubmit={handleEditSubmit} />
          </DialogContent>
        </Dialog>
      )}
    />
  )
}
