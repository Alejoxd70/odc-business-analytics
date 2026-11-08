import { useId } from 'react'
import { DataMind } from '../components/avatar/DataMind'
import { InfoPopup } from '../components/ui/InfoPopup'
import { modules } from '../content/modules'
import { screen08 as content } from '../content/screen08'

const moduleMeta = modules[2]

// Entrance as a relay (literal classes, so Tailwind detects them): each circle spins in
// and its connector draws (300 ms) towards the next circle, which arrives 210 ms later;
// each card rises right after its circle.
const circleEnter = ['enter-4', 'enter-7', 'enter-10', 'enter-13', 'enter-16']
const cardEnter = ['enter-5', 'enter-8', 'enter-11', 'enter-14', 'enter-17']

export const Screen08Module3Practices = () => {
  const bandTitleId = useId()
  return (
    <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-center gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-10 lg:gap-y-6 lg:py-6 xl:px-20">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <div className="flex flex-col gap-2">
          <p className="enter-0 enter-from-start text-small font-medium text-data">{moduleMeta.label}</p>
          <h1 tabIndex={-1} className="enter-1 text-h1">{moduleMeta.question}</h1>
        </div>
        <p className="enter-2 enter-blur max-w-287.5 text-body text-muted">{content.purpose}</p>
        <div className="enter-3 enter-pop flex flex-wrap gap-3">
          {content.info.map(item => <InfoPopup key={item.label} label={item.label} body={item.body} />)}
        </div>
      </div>

      {/* A sequence: vertical below 1024px, horizontal from 1024px. Circles and line are decorative: the list already conveys the order */}
      <ol className="grid gap-5 lg:col-span-2 lg:grid-cols-5">
        {content.practices.map((practice, index) => (
          <li key={practice.title} className="relative grid grid-cols-[42px_minmax(0,1fr)] gap-4 lg:flex lg:flex-col">
            {index < content.practices.length - 1 && (
              <span
                aria-hidden="true"
                className={`${circleEnter[index]} enter-draw-y lg:enter-draw-x [--enter-draw-duration:300ms] absolute top-5.25 left-[19.5px] h-[calc(100%+20px)] w-0.75 bg-data lg:top-[19.5px] lg:left-5.25 lg:h-0.75 lg:w-[calc(100%+20px)]`}
              />
            )}
            <span aria-hidden="true" className={`${circleEnter[index]} enter-zoom relative grid size-10.5 shrink-0 place-items-center rounded-full bg-data font-sans text-[19px] font-medium text-white`}>
              {index + 1}
            </span>
            <div className={`${cardEnter[index]} enter-rise flex flex-1 flex-col gap-2 rounded-card border-[1.5px] border-line bg-surface p-5`}>
              <h2 className="text-h3">{practice.title}</h2>
              <p className="text-small text-ink-soft">{practice.description}</p>
              <p className="mt-auto pt-3 text-caption text-muted">{practice.source}</p>
            </div>
          </li>
        ))}
      </ol>

      <section aria-labelledby={bandTitleId} className="enter-18 enter-wipe flex flex-col gap-1 rounded-card bg-data-soft px-6.5 py-4 sm:flex-row sm:items-center sm:gap-6">
        <p className="shrink-0 text-small font-medium text-data-deep">{content.band.label}</p>
        <div className="flex flex-col gap-0.5">
          <h2 id={bandTitleId} className="text-h3">{content.band.title}</h2>
          <p className="text-small text-ink-soft">{content.band.text}</p>
        </div>
      </section>

      <DataMind size="sm" className="enter-19 enter-from-end justify-self-end lg:col-start-2 lg:self-end" />
    </div>
  )
}
