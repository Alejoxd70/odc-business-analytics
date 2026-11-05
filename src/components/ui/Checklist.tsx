import { Check } from 'lucide-react'
import { useId } from 'react'
import { Card } from './Card'
import { useChecked } from '../../state/navigation'

export type ChecklistProps = {
  /** Key of the activity in the global state (e.g. "s11"). */
  id: string
  title: string
  items: string[]
  note?: string
  className?: string
}

/** Native checkboxes with no feedback or score; what is checked is kept in the store. */
export const Checklist = ({ id, title, items, note, className = '' }: ChecklistProps) => {
  const titleId = useId()
  const [checked, toggle] = useChecked(id)
  return (
    <Card as="section" aria-labelledby={titleId} className={`flex flex-col gap-3 p-6 xl:p-7 ${className}`}>
      <h2 id={titleId} className="text-h3">{title}</h2>
      <ul>
        {items.map((item, index) => {
          const number = index + 1
          return (
            <li key={item} className="border-t border-line">
              <label className="flex min-h-11 cursor-pointer items-center gap-3 py-2.5 text-small">
                <span className="grid shrink-0">
                  <input
                    type="checkbox"
                    checked={checked.includes(number)}
                    onChange={() => toggle(number)}
                    className="peer col-start-1 row-start-1 size-5 cursor-pointer appearance-none rounded-sm border-2 border-data bg-surface checked:bg-data"
                  />
                  <Check
                    aria-hidden="true"
                    strokeWidth={3}
                    className="pointer-events-none col-start-1 row-start-1 hidden size-3.5 place-self-center text-white peer-checked:block"
                  />
                </span>
                {item}
              </label>
            </li>
          )
        })}
      </ul>
      {note && <p className="text-caption text-muted">{note}</p>}
    </Card>
  )
}
