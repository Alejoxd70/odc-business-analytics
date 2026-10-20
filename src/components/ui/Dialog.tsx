import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Button } from './Button'
import { frame } from '../../content/frame'

export type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export const Dialog = ({ open, onClose, title, children }: DialogProps) => {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog || !open) return
    const opener = document.activeElement as HTMLElement | null
    dialog.showModal()
    return () => {
      dialog.close()
      opener?.focus()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-[560px] rounded-card bg-surface p-0 text-ink backdrop:bg-ink/40"
    >
      <div className="flex flex-col gap-5 p-7">
        <h2 id={titleId} className="text-h2">{title}</h2>
        <div className="text-body text-ink-soft">{children}</div>
        <Button variant="secondary" size="sm" className="self-end" onClick={onClose}>
          {frame.close}
        </Button>
      </div>
    </dialog>
  )
}
