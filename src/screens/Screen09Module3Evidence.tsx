import type { ReactNode } from 'react'
import { SequenceActivity } from '../activities/SequenceActivity'
import { DataMind } from '../components/avatar/DataMind'
import { HBarChart } from '../components/charts/HBarChart'
import { Card } from '../components/ui/Card'
import { modules } from '../content/modules'
import { screen09 as content } from '../content/screen09'

const moduleMeta = modules[2]
const { skewness, grouping, activity } = content

// Entrance (literal classes, so Tailwind detects them): the bars grow one after another,
// so the highlighted, shorter one lands last.
const barEnter = [
  'enter-5 enter-draw-x [--enter-draw-duration:500ms]',
  'enter-7 enter-draw-x [--enter-draw-duration:500ms]',
  'enter-9 enter-draw-x [--enter-draw-duration:500ms]',
]

const EvidenceCard = ({ label, title, source, enter, children }: { label: string, title: string, source: string, enter: string, children: ReactNode }) => (
  <Card as="article" className={`${enter} flex flex-col gap-3 p-6`}>
    <div className="flex flex-col gap-1">
      <p className="text-caption font-medium text-data">{label}</p>
      <h2 className="text-h3">{title}</h2>
    </div>
    {children}
    <p className="text-caption text-muted">{source}</p>
  </Card>
)

export const Screen09Module3Evidence = () => (
  <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-center gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,700px)_minmax(0,620px)_auto] lg:justify-between lg:gap-x-8 lg:py-8 xl:px-20">
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="enter-0 enter-from-start text-small font-medium text-data">{moduleMeta.label}</p>
        <h1 tabIndex={-1} className="enter-1 enter-blur text-h1">{content.title}</h1>
      </div>
      <div className="flex flex-col gap-3.5">
        <EvidenceCard label={skewness.label} title={skewness.title} source={skewness.source} enter="enter-2 enter-rise">
          <HBarChart title={skewness.chartTitle} items={skewness.bars} max={skewness.max} barEnter={barEnter} />
        </EvidenceCard>
        <EvidenceCard label={grouping.label} title={grouping.title} source={grouping.source} enter="enter-4 enter-rise">
          <div className="grid gap-3 sm:grid-cols-2">
            <p className="enter-8 enter-from-start flex flex-col gap-1 rounded-control bg-paper p-4">
              <span className="text-small text-muted">{grouping.standardized.label}</span>
              {' '}
              <span className="text-small">{grouping.standardized.text}</span>
            </p>
            <p className="enter-10 enter-grow flex flex-col gap-1 rounded-control bg-data-soft p-4">
              <span className="text-small text-data-deep">{grouping.grouped.label}</span>
              {' '}
              <span className="text-small">{grouping.grouped.text}</span>
            </p>
          </div>
        </EvidenceCard>
      </div>
    </div>

    <SequenceActivity
      id="s09"
      title={activity.title}
      instruction={activity.instruction}
      steps={activity.steps}
      initialOrder={activity.initialOrder}
      reviewFeedback={activity.reviewFeedback}
      className="enter-3 enter-swing lg:self-start"
    />

    <DataMind size="sm" className="enter-11 enter-pop justify-self-end lg:self-end" />
  </div>
)
