import { Check } from 'lucide-react'
import { useId } from 'react'
import { DataMind } from '../components/avatar/DataMind'
import { DumbbellChart } from '../components/charts/DumbbellChart'
import { Card } from '../components/ui/Card'
import { InfoPopup } from '../components/ui/InfoPopup'
import { modules } from '../content/modules'
import { screen11 as content } from '../content/screen11'
import { useChecked } from '../state/navigation'

const moduleMeta = modules[3]
const { governance, chart } = content

/** Native checkboxes: the person marks what the company already has. No feedback or score. */
const GovernanceChecklist = () => {
  const titleId = useId()
  const [checked, toggle] = useChecked('s11')
  return (
    <Card as="section" aria-labelledby={titleId} className="flex flex-col gap-3 p-6 lg:self-start xl:p-7">
      <h2 id={titleId} className="text-h3">{governance.title}</h2>
      <ul>
        {governance.items.map((item, index) => {
          const number = index + 1
          return (
            <li key={item} className="border-t border-line">
              <label className="flex min-h-11 cursor-pointer items-center gap-3 py-2.5 text-small">
                <span className="grid shrink-0">
                  <input
                    type="checkbox"
                    checked={checked.includes(number)}
                    onChange={() => toggle(number)}
                    className="peer col-start-1 row-start-1 size-5 cursor-pointer appearance-none rounded-sm border-2 border-data bg-surface checked:bg-data"
                  />
                  <Check
                    aria-hidden="true"
                    strokeWidth={3}
                    className="pointer-events-none col-start-1 row-start-1 hidden size-3.5 place-self-center text-white peer-checked:block"
                  />
                </span>
                {item}
              </label>
            </li>
          )
        })}
      </ul>
      <p className="text-caption text-muted">{governance.note}</p>
    </Card>
  )
}

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

      <GovernanceChecklist />

      <Card as="section" aria-labelledby={chartTitleId} className="flex flex-col gap-3 p-6 xl:p-7">
        <h2 id={chartTitleId} className="text-h3">{chart.title}</h2>
        <DumbbellChart items={chart.items} legend={chart.legend} srValue={chart.srValue} connector={chart.connector} />
        <p className="text-caption text-muted">{chart.note}</p>
      </Card>

      <DataMind size="sm" className="justify-self-end lg:self-end" />
    </div>
  )
}
