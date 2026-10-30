import { ClassifyActivity } from '../activities/ClassifyActivity'
import { DataMind } from '../components/avatar/DataMind'
import { modules } from '../content/modules'
import { screen07 as content } from '../content/screen07'

const moduleMeta = modules[1]

export const Screen07Module2Classify = () => (
  <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-center gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-10 xl:px-20">
    <div className="flex flex-col gap-2">
      <p className="text-small font-medium text-data">{moduleMeta.label}</p>
      <h1 tabIndex={-1} className="text-h1">{content.title}</h1>
      <p className="text-body text-muted">{content.instruction}</p>
    </div>

    <ClassifyActivity id="s07" cases={content.cases} className="lg:row-start-2" />

    <DataMind size="sm" className="justify-self-end lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start" />
  </div>
)
