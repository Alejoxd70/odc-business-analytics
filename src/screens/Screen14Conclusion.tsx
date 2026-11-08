import { Check } from 'lucide-react'
import { useId } from 'react'
import { DataMind } from '../components/avatar/DataMind'
import { Checklist } from '../components/ui/Checklist'
import { isModuleVisited, modules } from '../content/modules'
import { screen14 as content } from '../content/screen14'
import { useNavigation } from '../state/navigation'

// Entrance as a recap of the route (literal classes, so Tailwind detects them): each
// station spins in and its line draws (300 ms) to the next one, which arrives 210 ms
// later; the module's key idea comes into focus right after its station.
const stationEnter = ['enter-2', 'enter-5', 'enter-8', 'enter-11']
const ideaEnter = ['enter-3', 'enter-6', 'enter-9', 'enter-12']

/** Summary of the route: same visual logic as the menu, but the stations are not buttons. */
const ModuleRoute = () => {
  const { state } = useNavigation()
  return (
    <ol aria-label={content.routeLabel} className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
      {modules.map((module, index) => {
        const visited = isModuleVisited(module, state.visited)
        return (
          <li key={module.number} className="relative flex gap-4 lg:flex-col lg:gap-4">
            {/* Line to the next station: vertical below 1024 px, horizontal from there up */}
            {index < modules.length - 1 && (
              <span
                aria-hidden="true"
                className={`${stationEnter[index]} enter-draw-y lg:enter-draw-x [--enter-draw-duration:300ms] absolute top-[21px] left-[19.5px] h-[calc(100%+1.5rem)] w-0.75 bg-data lg:top-[19.5px] lg:left-[21px] lg:h-0.75 lg:w-[calc(100%+2rem)]`}
              />
            )}
            <span
              aria-hidden="true"
              className={`${stationEnter[index]} enter-zoom relative flex size-10.5 shrink-0 items-center justify-center rounded-full text-small font-medium ${
                visited ? 'bg-data text-white' : 'border-[2.5px] border-data bg-surface text-data'
              }`}
            >
              {visited ? <Check size={18} strokeWidth={2.75} /> : module.number}
            </span>
            <div className={`${ideaEnter[index]} enter-blur flex min-w-0 flex-col gap-1 pt-1 lg:pt-0`}>
              <p className="text-caption font-medium text-data">
                {module.label}
                {' '}
                <span className="sr-only">{`(${visited ? content.visited : content.pending})`}</span>
              </p>
              <p className="font-display text-h3">{module.question}</p>
              <p className="text-small text-ink-soft">{content.keyIdeas[index]}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export const Screen14Conclusion = () => {
  const literatureId = useId()
  const { literature } = content
  return (
    <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-center gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,760fr)_minmax(0,420fr)_auto] lg:gap-x-8 lg:py-8 xl:px-20">
      <div className="flex flex-col gap-2 lg:col-span-3">
        <p className="enter-0 enter-from-start text-small font-medium text-data">{content.label}</p>
        <h1 tabIndex={-1} className="enter-1 text-h1">{content.title}</h1>
      </div>

      <div className="lg:col-span-3 lg:pb-4">
        <ModuleRoute />
      </div>

      <Checklist id="s14" title={content.nextSteps.title} items={content.nextSteps.items} className="enter-13 enter-tilt lg:self-start" />

      <section aria-labelledby={literatureId} className="enter-14 enter-wipe on-dark flex flex-col gap-3 rounded-card bg-ink p-6 lg:self-start xl:p-7">
        <h2 id={literatureId} className="font-sans text-caption font-medium text-signal">{literature.title}</h2>
        <p className="font-display text-h3 text-white">{literature.lead}</p>
        <p className="text-small text-line">{literature.rest}</p>
      </section>

      <DataMind size="sm" className="enter-15 enter-rise justify-self-end lg:self-end" />
    </div>
  )
}
