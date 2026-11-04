import { Plus } from 'lucide-react'
import { useState } from 'react'
import { DataMind } from '../components/avatar/DataMind'
import { Card } from '../components/ui/Card'
import { Dialog } from '../components/ui/Dialog'
import { stateTone } from '../components/ui/stateTone'
import { modules } from '../content/modules'
import { screen10 as content } from '../content/screen10'
import type { DataStateId } from '../content/states'

const moduleMeta = modules[2]
const { checklist } = content

const StatePills = ({ states }: { states: DataStateId[] }) => (
  <p className="flex shrink-0 items-center gap-1.5">
    <span className="sr-only">{content.servesInText(states)}</span>
    <span aria-hidden="true" className="flex flex-wrap items-center gap-1.5">
      <span className="text-caption text-muted">{content.servesIn}</span>
      {states.map(state => (
        <span key={state} className={`rounded-full px-2.5 py-0.5 text-caption font-medium ${stateTone[state].bg} ${stateTone[state].text}`}>
          {content.stateLabel(state)}
        </span>
      ))}
    </span>
  </p>
)

export const Screen10Module3EntryRoutes = () => {
  const [open, setOpen] = useState(false)
  return (
    <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-center gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-10 lg:gap-y-6 lg:py-8 xl:px-20">
      <div className="flex flex-col gap-2 lg:col-span-2">
        <p className="text-small font-medium text-data">{moduleMeta.label}</p>
        <h1 tabIndex={-1} className="text-h1">{content.title}</h1>
        <p className="text-body text-muted">{content.intro}</p>
      </div>

      <ul className="grid gap-5 lg:grid-cols-2">
        {content.routes.map(route => (
          <li key={route.title}>
            <Card className="flex h-full flex-col gap-2 px-5.5 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <h2 className="text-h3">{route.title}</h2>
                <StatePills states={route.states} />
              </div>
              <p className="text-small text-ink-soft">{route.description}</p>
              <p className="text-caption text-muted">{route.source}</p>
            </Card>
          </li>
        ))}
        {/* on-dark on the wrapper: the white focus ring applies to its descendants */}
        <li className="on-dark">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
            className="flex h-full w-full flex-col gap-2 rounded-card bg-ink px-6 py-4.5 text-left"
          >
            <span className="flex items-center gap-3">
              <span aria-hidden="true" className="grid size-6.5 shrink-0 place-items-center rounded-full bg-signal text-ink">
                <Plus className="size-4" strokeWidth={2.5} />
              </span>
              <span className="font-display text-h3 text-white">{checklist.title}</span>
            </span>
            {' '}
            <span className="text-small text-line">{checklist.text}</span>
          </button>
        </li>
      </ul>

      {/* Outside the on-dark wrapper: the dialog is a light surface */}
      <Dialog open={open} onClose={() => setOpen(false)} title={checklist.title}>
        <ol className="flex list-decimal flex-col gap-2 pl-5">
          {checklist.questions.map(question => <li key={question}>{question}</li>)}
        </ol>
      </Dialog>

      <DataMind size="sm" className="justify-self-end lg:col-start-2 lg:self-end" />
    </div>
  )
}
