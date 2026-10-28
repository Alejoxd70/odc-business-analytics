import { DataMind } from '../components/avatar/DataMind'
import { Card } from '../components/ui/Card'
import { InfoPopup } from '../components/ui/InfoPopup'
import { modules } from '../content/modules'
import { screen04 as content, type SegmentTone } from '../content/screen04'

const moduleMeta = modules[0]
const { infographic } = content

// Full class names so Tailwind can detect them.
const toneBg: Record<SegmentTone, string> = {
  'ink': 'bg-ink',
  'rule-strong': 'bg-rule-strong',
  'data': 'bg-data',
}

const MicroBusinessFigure = () => (
  <Card as="article" className="p-6 xl:p-9">
    <figure className="flex flex-col gap-6">
      <figcaption className="flex flex-col gap-1">
        <span className="font-display text-h2">{infographic.title}</span>
        <span className="text-small text-muted">{infographic.subtitle}</span>
      </figcaption>

      <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-display text-[64px] leading-none">{infographic.headline.value}</span>
        {' '}
        <span className="text-[18px] leading-snug">{infographic.headline.text}</span>
      </p>

      <div className="flex flex-col gap-3">
        {/* The legend already gives the values as text: the bar is decorative */}
        <div aria-hidden="true" className="flex h-8.5 overflow-hidden rounded-control">
          {infographic.segments.map(segment => (
            <span key={segment.tone} className={toneBg[segment.tone]} style={{ width: `${segment.share}%` }} />
          ))}
        </div>
        <ul className="flex flex-col gap-1.5">
          {infographic.segments.map(segment => (
            <li key={segment.tone} className="flex items-baseline gap-2.5 text-small">
              <span aria-hidden="true" className={`size-3.5 shrink-0 translate-y-0.5 rounded-[3px] ${toneBg[segment.tone]}`} />
              {segment.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {infographic.facts.map(fact => (
          <p key={fact.value} className="flex flex-col gap-1 rounded-control bg-paper p-4">
            <span className="font-display text-[30px] leading-tight">{fact.value}</span>
            {' '}
            <span className="text-small text-ink-soft">{fact.text}</span>
          </p>
        ))}
      </div>

      <p className="text-caption text-muted">{infographic.source}</p>
    </figure>
  </Card>
)

export const Screen04Module1 = () => (
  <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-center gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,700px)_minmax(0,660px)] lg:justify-between lg:gap-x-12 xl:px-20">
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-small font-medium text-data">{moduleMeta.label}</p>
        <h1 tabIndex={-1} className="text-h1">{moduleMeta.question}</h1>
      </div>
      {content.paragraphs.map(paragraph => (
        <p key={paragraph} className="text-body text-ink-soft">{paragraph}</p>
      ))}
      <div className="flex flex-wrap gap-3 pt-2">
        {content.info.map(item => <InfoPopup key={item.label} label={item.label} body={item.body} />)}
      </div>
    </div>

    <div className="flex flex-col gap-4">
      <MicroBusinessFigure />
      <DataMind size="sm" className="self-end" />
    </div>
  </div>
)
