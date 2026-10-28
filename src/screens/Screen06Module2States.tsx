import { DataMind } from '../components/avatar/DataMind'
import { InfoPopup } from '../components/ui/InfoPopup'
import { modules } from '../content/modules'
import { screen06 as content } from '../content/screen06'
import type { DataStateId } from '../content/states'

const moduleMeta = modules[1]

// Full class names so Tailwind can detect them.
const stepStyles: Record<DataStateId, { box: string, main: string, meta: string }> = {
  1: { box: 'bg-state-1 lg:min-h-47.5', main: 'text-ink', meta: 'text-ink-soft' },
  2: { box: 'bg-state-2 lg:min-h-60.5', main: 'text-ink', meta: 'text-ink-soft' },
  3: { box: 'bg-state-3 lg:min-h-73.5', main: 'text-ink', meta: 'text-ink-soft' },
  4: { box: 'bg-state-4 lg:min-h-86.5', main: 'text-white', meta: 'text-white' },
}

export const Screen06Module2States = () => (
  <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-center gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-12 lg:gap-y-6 lg:py-6 xl:px-20">
    <div className="flex max-w-205 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-small font-medium text-data">{moduleMeta.label}</p>
        <h1 tabIndex={-1} className="text-h1">{moduleMeta.question}</h1>
      </div>
      {content.paragraphs.map(paragraph => (
        <p key={paragraph} className="text-body text-ink-soft">{paragraph}</p>
      ))}
      <div className="flex flex-wrap gap-3 pt-1">
        {content.info.map(item => <InfoPopup key={item.label} label={item.label} body={item.body} />)}
      </div>
    </div>

    {/* Below 1024px a vertical list of equal-height cards; from 1024px a staircase on a common floor */}
    <ol
      aria-label={content.stairsLabel}
      className="grid auto-rows-fr gap-4 lg:col-span-2 lg:row-start-2 lg:auto-rows-auto lg:grid-cols-4 lg:items-end lg:gap-5 lg:border-b-2 lg:border-ink/25"
    >
      {content.states.map((state) => {
        const style = stepStyles[state.id]
        return (
          <li key={state.id} className={`flex flex-col gap-1 rounded-card px-5.5 py-5 lg:rounded-b-none ${style.box}`}>
            <p className={`text-caption font-medium ${style.meta}`}>{state.label}</p>
            <h2 className={`text-h3 ${style.main}`}>{state.name}</h2>
            <p className={`text-small ${style.main}`}>{state.description}</p>
            <p className={`pt-1 text-caption ${style.meta}`}>{state.source}</p>
          </li>
        )
      })}
    </ol>

    <DataMind size="sm" className="justify-self-end lg:col-start-2 lg:row-start-1 lg:self-start" />
  </div>
)
