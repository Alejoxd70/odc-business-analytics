import { Crossword } from '../activities/Crossword'
import { DataMind } from '../components/avatar/DataMind'
import { screen13 as content } from '../content/screen13'

export const Screen13FinalAssessment = () => (
  <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-center gap-6 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:grid-rows-[auto_auto_1fr_auto] lg:gap-x-8 lg:py-8 xl:grid-cols-[minmax(0,35rem)_minmax(0,1fr)_auto] xl:grid-rows-[auto_auto_1fr] xl:px-12">
    <div className="flex flex-col gap-2 lg:col-start-1 lg:row-start-1">
      <p className="text-small font-medium text-data">{content.label}</p>
      <h1 tabIndex={-1} className="text-h1">{content.title}</h1>
      <p className="max-w-140 text-body text-muted">{content.intro}</p>
    </div>

    <Crossword
      id="s13"
      text={content.crossword}
      placement={{
        grid: 'lg:col-start-1 lg:row-start-2',
        controls: 'lg:col-start-1 lg:row-start-3',
        panel: 'lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-start',
      }}
    />

    <DataMind size="sm" className="justify-self-end lg:col-start-2 lg:row-start-4 xl:col-start-3 xl:row-span-3 xl:row-start-1 xl:self-end" />
  </div>
)
