import { useId } from 'react'
import { DataMind } from '../components/avatar/DataMind'
import { DumbbellChart } from '../components/charts/DumbbellChart'
import { Card } from '../components/ui/Card'
import { Checklist } from '../components/ui/Checklist'
import { InfoPopup } from '../components/ui/InfoPopup'
import { modules } from '../content/modules'
import { screen11 as content } from '../content/screen11'

const moduleMeta = modules[3]
const { governance, chart } = content

export const Screen11Module4Governance = () => {
  const chartTitleId = useId()
  return (
    <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-center gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,640fr)_minmax(0,760fr)_auto] lg:gap-x-8 lg:gap-y-6 lg:py-8 xl:px-20">
      <div className="flex flex-col gap-3 lg:col-span-3">
        <div className="flex flex-col gap-2">
          <p className="text-small font-medium text-data">{moduleMeta.label}</p>
          <h1 tabIndex={-1} className="text-h1">{moduleMeta.question}</h1>
          <p className="text-body text-muted">{content.purpose}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {content.info.map(item => <InfoPopup key={item.label} label={item.label} body={item.body} />)}
        </div>
      </div>

      <Checklist id="s11" title={governance.title} items={governance.items} note={governance.note} className="lg:self-start" />

      <Card as="section" aria-labelledby={chartTitleId} className="flex flex-col gap-3 p-6 xl:p-7">
        <h2 id={chartTitleId} className="text-h3">{chart.title}</h2>
        <DumbbellChart items={chart.items} legend={chart.legend} srValue={chart.srValue} connector={chart.connector} />
        <p className="text-caption text-muted">{chart.note}</p>
      </Card>

      <DataMind size="sm" className="justify-self-end lg:self-end" />
    </div>
  )
}
