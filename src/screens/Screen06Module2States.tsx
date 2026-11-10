import { InfoPopup } from '../components/ui/InfoPopup'
import { stateTone } from '../components/ui/stateTone'
import { modules } from '../content/modules'
import { screen06 as content } from '../content/screen06'
import type { DataStateId } from '../content/states'

const moduleMeta = modules[1]

// Full class names so Tailwind can detect them. Colors come from stateTone.
// `enter` makes the staircase rise one step at a time, from state 1 to state 4.
const stepStyles: Record<DataStateId, { height: string, meta: string, enter: string }> = {
  1: { height: 'lg:min-h-47.5', meta: 'text-ink-soft', enter: 'enter-5' },
  2: { height: 'lg:min-h-60.5', meta: 'text-ink-soft', enter: 'enter-7' },
  3: { height: 'lg:min-h-73.5', meta: 'text-ink-soft', enter: 'enter-9' },
  4: { height: 'lg:min-h-86.5', meta: 'text-white', enter: 'enter-11' },
}

const paragraphEnter = ['enter-2', 'enter-3']

export const Screen06Module2States = () => (
  <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-center gap-10 px-4 py-10 sm:px-8 lg:gap-x-12 lg:gap-y-6 lg:py-6 xl:px-20">
    <div className="flex max-w-205 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="enter-0 enter-from-start text-small font-medium text-data">{moduleMeta.label}</p>
        <h1 tabIndex={-1} className="enter-1 text-h1">{moduleMeta.question}</h1>
      </div>
      {content.paragraphs.map((paragraph, i) => (
        <p key={paragraph} className={`${paragraphEnter[i]} text-body text-ink-soft`}>{paragraph}</p>
      ))}
      <div className="enter-4 enter-pop flex flex-wrap gap-3 pt-1">
        {content.info.map(item => <InfoPopup key={item.label} label={item.label} body={item.body} />)}
      </div>
    </div>

    {/* Below 1024px a vertical list of equal-height cards; from 1024px a staircase on a common floor */}
    <ol
      aria-label={content.stairsLabel}
      className="grid auto-rows-fr gap-4 lg:auto-rows-auto lg:grid-cols-4 lg:items-end lg:gap-5 lg:border-b-2 lg:border-ink/25"
    >
      {content.states.map((state) => {
        const style = stepStyles[state.id]
        const tone = stateTone[state.id]
        return (
          <li key={state.id} className={`${style.enter} enter-reveal flex flex-col gap-1 rounded-card px-5.5 py-5 lg:rounded-b-none ${tone.bg} ${style.height}`}>
            <p className={`text-caption font-medium ${style.meta}`}>{state.label}</p>
            <h2 className={`text-h3 ${tone.text}`}>{state.name}</h2>
            <p className={`text-small ${tone.text}`}>{state.description}</p>
            <p className={`pt-1 text-caption ${style.meta}`}>{state.source}</p>
          </li>
        )
      })}
    </ol>

  </div>
)
