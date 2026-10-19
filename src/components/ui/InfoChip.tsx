import { Plus } from 'lucide-react'

export type InfoChipProps = {
  label: string
  onClick?: () => void
}

export const InfoChip = ({ label, onClick }: InfoChipProps) => (
  <button
    type="button"
    aria-haspopup="dialog"
    onClick={onClick}
    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-data-soft py-1.5 pr-4 pl-1.5 text-small font-medium text-data-deep transition-[color,background-color] hover:bg-state-3"
  >
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-data text-white">
      <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
    </span>
    {label}
  </button>
)
