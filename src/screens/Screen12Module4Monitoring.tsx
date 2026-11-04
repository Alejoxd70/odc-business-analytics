import { ArrowRight } from 'lucide-react'
import { MonitoringSimulator } from '../activities/MonitoringSimulator'
import { DataMind } from '../components/avatar/DataMind'
import { Card } from '../components/ui/Card'
import { modules } from '../content/modules'
import { screen12 as content } from '../content/screen12'

const moduleMeta = modules[3]
const { caseStudy, quote } = content

export const Screen12Module4Monitoring = () => (
  <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-center gap-6 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)_auto] lg:gap-x-8 lg:py-8 xl:px-20">
    {/* One column for header and cards: it never stretches with the simulator */}
    <div className="flex flex-col gap-4 lg:col-start-1 lg:self-start">
      <div className="flex flex-col gap-2 pb-2">
        <p className="text-small font-medium text-data">{moduleMeta.label}</p>
        <h1 tabIndex={-1} className="text-h1">{content.title}</h1>
      </div>

      <Card as="article" className="@container flex flex-col gap-4 p-5 xl:p-6">
        <h2 className="font-sans text-caption font-medium text-data">{caseStudy.label}</h2>
        <ol className="flex flex-col items-stretch gap-1.5 @sm:flex-row @sm:items-center">
          {caseStudy.steps.map((step, index) => (
            <li key={step} className="contents">
              {index > 0 && <ArrowRight aria-hidden="true" className="size-4 shrink-0 rotate-90 self-center text-data @sm:rotate-0" />}
              <span className="flex-1 self-stretch rounded-control bg-paper px-3 py-2 text-caption">{step}</span>
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-2 gap-3">
          {caseStudy.facts.map(fact => (
            <p key={fact.value} className="flex flex-col gap-1 rounded-control bg-data-soft p-3">
              <span className="font-display text-[26px] leading-tight">{fact.value}</span>
              {' '}
              <span className="text-caption">{fact.text}</span>
            </p>
          ))}
        </div>
        <p className="text-small text-ink-soft">{caseStudy.note}</p>
        <p className="text-caption text-muted">{caseStudy.source}</p>
      </Card>

      <div className="flex flex-col gap-1.5 rounded-card bg-ink px-5 py-3.5">
        <p className="text-small text-line">
          <span className="font-medium text-signal">{quote.lead}</span>
          {' '}
          {quote.rest}
        </p>
        <p className="text-caption text-rule-strong">{quote.source}</p>
      </div>
    </div>

    <MonitoringSimulator id="s12" text={content.simulator} className="lg:col-start-2 lg:self-start" />

    <DataMind size="sm" className="justify-self-end lg:col-start-3 lg:self-end" />
  </div>
)
