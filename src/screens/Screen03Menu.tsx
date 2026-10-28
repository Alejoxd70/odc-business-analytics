import { Check } from 'lucide-react'
import { DataMind } from '../components/avatar/DataMind'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { isModuleVisited, modules, type ModuleMeta } from '../content/modules'
import { screen03 as content } from '../content/screen03'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useNavigation } from '../state/navigation'

// Fixed column for "registro" / "análisis" and, below, for DataMind (sm = 84 px).
const endColumn = 'w-24 shrink-0'

const ModuleStop = ({ module, visited, onSelect }: {
  module: ModuleMeta
  visited: boolean
  onSelect: () => void
}) => (
  <button
    type="button"
    onClick={onSelect}
    className="group flex h-full w-full items-center rounded-card text-left lg:flex-col-reverse"
  >
    {/* Station on the route line */}
    <span
      aria-hidden="true"
      className={`relative z-10 flex size-16 shrink-0 items-center justify-center rounded-full text-h2 font-medium ${
        visited ? 'bg-data text-white' : 'border-[2.5px] border-data bg-surface text-data'
      }`}
    >
      {module.number}
    </span>
    {/* Connector between station and card */}
    <span aria-hidden="true" className="h-px w-4 shrink-0 bg-line lg:h-7 lg:w-px" />
    <Card className="flex min-w-0 flex-1 flex-col gap-2 p-5 transition-[border-color] group-hover:border-data group-focus-visible:border-data lg:w-full xl:p-6">
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

// Dotted arrow from DataMind to station 1. The tip sits at the top-right corner.
const PointerArrow = () => (
  <svg
    viewBox="0 0 130 90"
    preserveAspectRatio="xMaxYMin meet"
    aria-hidden="true"
    className="h-24 w-1/2 overflow-visible"
  >
    <path d="M8 84 C 70 74, 122 46, 128 10" fill="none" className="stroke-signal" strokeWidth={2.5} strokeDasharray="3 6" strokeLinecap="round" />
    <path d="M119 16 L128 4 L134 18" fill="none" className="stroke-signal" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Screen03Menu = () => {
  const { state, goTo } = useNavigation()
  // A single DataMind instance: the avatar SVG uses fixed ids in its <defs>.
  const horizontal = useMediaQuery('(min-width: 1024px)')

  const otherSections = (
    <ul className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
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
      <h1 tabIndex={-1} className="max-w-4xl text-h1">{content.title}</h1>

      <nav aria-label={content.navLabel} className="flex flex-col gap-10 lg:gap-2">
        {/* Route: vertical below 1024 px, horizontal from there up */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
          <span aria-hidden="true" className={`font-display text-h3 text-muted italic lg:pb-4.5 lg:text-right ${endColumn}`}>
            {content.railStart}
          </span>
          <div className="relative min-w-0 flex-1">
            <span aria-hidden="true" className="absolute top-0 bottom-0 left-[30.5px] w-0.75 bg-data lg:top-auto lg:right-0 lg:bottom-[30.5px] lg:left-0 lg:h-0.75 lg:w-auto" />
            <ol className="relative grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
              {modules.map(module => (
                <li key={module.number}>
                  <ModuleStop
                    module={module}
                    visited={isModuleVisited(module, state.visited)}
                    onSelect={() => goTo(module.start)}
                  />
                </li>
              ))}
            </ol>
          </div>
          <span aria-hidden="true" className={`font-display text-h3 text-muted italic lg:pb-4.5 ${endColumn}`}>
            {content.railEnd}
          </span>
        </div>

        {/* DataMind with arrow (horizontal only) and other sections */}
        {horizontal
          ? (
              <div className="flex items-end gap-4">
                <div className={`flex justify-center ${endColumn}`}>
                  <DataMind size="sm" />
                </div>
                <div className="grid min-w-0 flex-1 grid-cols-4 items-end gap-8">
                  <div className="flex self-start">
                    <PointerArrow />
                  </div>
                  <div className="col-span-3 flex justify-center pb-6">{otherSections}</div>
                </div>
                <span className={endColumn} />
              </div>
            )
          : (
              <div className="flex flex-col items-center gap-10">
                <div className="w-full">{otherSections}</div>
                <DataMind size="sm" />
              </div>
            )}
      </nav>
    </div>
  )
}
