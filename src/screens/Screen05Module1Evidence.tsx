import { TrueFalseActivity } from '../activities/TrueFalseActivity'
import { DataMind } from '../components/avatar/DataMind'
import { modules } from '../content/modules'
import { screen05 as content } from '../content/screen05'

const moduleMeta = modules[0]

// Entrance steps (literal, so Tailwind detects them): each evidence row slides in and,
// right after, its figure grows.
const rowEnter = ['enter-2', 'enter-4', 'enter-6']
const figureEnter = ['enter-3', 'enter-5', 'enter-7']

export const Screen05Module1Evidence = () => (
  <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-center gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,680px)_minmax(0,1fr)] lg:gap-x-12 xl:px-20">
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="enter-0 enter-from-start text-small font-medium text-data">{moduleMeta.label}</p>
        <h1 tabIndex={-1} className="enter-1 text-h1">{content.title}</h1>
      </div>
      <ul>
        {content.evidence.map((item, i) => (
          <li key={item.source} className={`${rowEnter[i]} enter-from-start flex flex-col gap-x-6 gap-y-1 border-t-[1.5px] border-line py-5 sm:flex-row`}>
            <p className={`${figureEnter[i]} enter-grow origin-left font-display text-[34px] leading-tight sm:min-w-47.5`}>{item.figure}</p>
            <div className="flex flex-col gap-1">
              <p className="text-[16.5px] leading-normal text-ink-soft">{item.text}</p>
              <p className="text-caption text-muted">{item.source}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
      <TrueFalseActivity
        id="s05"
        title={content.activity.title}
        items={content.activity.items}
        className="enter-4 enter-tilt min-w-0 flex-1 lg:max-w-150"
      />
      <DataMind size="sm" className="enter-9 enter-rise self-end lg:shrink-0" />
    </div>
  </div>
)
