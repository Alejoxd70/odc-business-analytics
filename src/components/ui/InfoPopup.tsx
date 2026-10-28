import { useState, type ReactNode } from 'react'
import { Dialog } from './Dialog'
import { InfoChip } from './InfoChip'

export type InfoPopupProps = {
  /** Chip text and dialog title. */
  label: string
  body: ReactNode
}

/** "+info" chip that opens an accessible dialog with its explanation. */
export const InfoPopup = ({ label, body }: InfoPopupProps) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <InfoChip label={label} onClick={() => setOpen(true)} />
      <Dialog open={open} onClose={() => setOpen(false)} title={label}>
        {typeof body === 'string' ? <p>{body}</p> : body}
      </Dialog>
    </>
  )
}
