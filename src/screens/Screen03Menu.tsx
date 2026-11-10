import { Check } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { isModuleVisited, modules, type ModuleMeta } from '../content/modules'
import { screen03 as content } from '../content/screen03'
import { useNavigation } from '../state/navigation'

// Fixed width for the "registro" / "análisis" labels at both ends of the route.
const endColumn = 'w-24 shrink-0'

// Entrance steps timed to the route line (enter-2, 700 ms): each station appears as the
// line reaches it, then its card. Literal class names so Tailwind detects them.
const stationEnter = ['enter-3', 'enter-6', 'enter-8', 'enter-11']
const cardEnter = ['enter-4', 'enter-7', 'enter-9', 'enter-12']

const ModuleStop = ({ module, visited, onSelect, stationClass, cardClass }: {
  module: ModuleMeta
  visited: boolean
  onSelect: () => void
  stationClass: string
  cardClass: string
}) => (
  <button
    type="button"
    onClick={onSelect}
    className="group flex h-full w-full items-center rounded-card text-left lg:flex-col-reverse"
  >
    {/* Station on the route line */}
    <span
      aria-hidden="true"
      className={`${stationClass} enter-grow relative z-10 flex size-16 shrink-0 items-center justify-center rounded-full text-h2 font-medium ${
        visited ? 'bg-data text-white' : 'border-[2.5px] border-data bg-surface text-data'
      }`}
    >
      {module.number}
    </span>
    {/* Connector between station and card */}
    <span aria-hidden="true" className={`${cardClass} h-px w-4 shrink-0 bg-line lg:h-7 lg:w-px`} />
    <Card className={`${cardClass} enter-rise flex min-w-0 flex-1 flex-col gap-2 p-5 transition-[border-color] group-hover:border-data group-focus-visible:border-data lg:w-full xl:p-6`}>
      <span className="flex items-center gap-2 text-small font-medium text-muted">
        {module.label}
        {visited && <Check size={16} strokeWidth={2.5} className="text-data" aria-hidden="true" />}
      </span>
      {/* Explicit spaces: separate label, question and state in the accessible name */}
      {' '}
      <span className="font-display text-h3 text-ink">{module.question}</span>
      {' '}
      <span className="sr-only">{`(${visited ? content.visited : content.pending})`}</span>
    </Card>
  </button>
)

export const Screen03Menu = () => {
  const { state, goTo } = useNavigation()

  const otherSections = (
    <ul className="enter-15 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
      {content.otherSections.map(section => (
        <li key={section.target}>
          <Button variant="secondary" size="sm" className="w-full" onClick={() => goTo(section.target)}>
            {section.label}
          </Button>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="mx-auto flex min-h-full max-w-360 flex-col gap-10 px-4 py-10 sm:px-8 xl:px-20 xl:py-12">
      <h1 tabIndex={-1} className="enter-0 max-w-4xl text-h1">{content.title}</h1>

      <nav aria-label={content.navLabel} className="flex flex-col gap-10">
        {/* Route: vertical below 1024 px, horizontal from there up */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
          <span aria-hidden="true" className={`enter-1 enter-from-start font-display text-h3 text-muted italic lg:pb-4.5 lg:text-right ${endColumn}`}>
            {content.railStart}
          </span>
          <div className="relative min-w-0 flex-1">
            <span aria-hidden="true" className="enter-2 enter-draw-y lg:enter-draw-x absolute top-0 bottom-0 left-[30.5px] w-0.75 bg-data lg:top-auto lg:right-0 lg:bottom-[30.5px] lg:left-0 lg:h-0.75 lg:w-auto" />
            <ol className="relative grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
              {modules.map((module, i) => (
                <li key={module.number}>
                  <ModuleStop
                    module={module}
                    visited={isModuleVisited(module, state.visited)}
                    onSelect={() => goTo(module.start)}
                    stationClass={stationEnter[i]}
                    cardClass={cardEnter[i]}
                  />
                </li>
              ))}
            </ol>
          </div>
          <span aria-hidden="true" className={`enter-13 enter-from-end font-display text-h3 text-muted italic lg:pb-4.5 ${endColumn}`}>
            {content.railEnd}
          </span>
        </div>

        <div className="w-full">{otherSections}</div>
      </nav>
    </div>
  )
}
