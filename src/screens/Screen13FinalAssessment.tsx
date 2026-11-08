import { Crossword } from '../activities/Crossword'
import { DataMind } from '../components/avatar/DataMind'
import { screen13 as content } from '../content/screen13'

// Entrance on the crossword's three blocks (they stay mounted while answering): the grid
// grows into place, the clue panel slides in from the right, then the controls rise.
export const Screen13FinalAssessment = () => (
  <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-center gap-6 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:grid-rows-[auto_auto_1fr_auto] lg:gap-x-8 lg:py-8 xl:grid-cols-[minmax(0,35rem)_minmax(0,1fr)_auto] xl:grid-rows-[auto_auto_1fr] xl:px-12">
    <div className="flex flex-col gap-2 lg:col-start-1 lg:row-start-1">
      <p className="enter-0 enter-from-start text-small font-medium text-data">{content.label}</p>
      <h1 tabIndex={-1} className="enter-1 enter-blur text-h1">{content.title}</h1>
      <p className="enter-2 enter-blur max-w-140 text-body text-muted">{content.intro}</p>
    </div>

    <Crossword
      id="s13"
      text={content.crossword}
      placement={{
        grid: 'enter-3 enter-grow lg:col-start-1 lg:row-start-2',
        controls: 'enter-6 enter-rise lg:col-start-1 lg:row-start-3',
        panel: 'enter-4 enter-from-end lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-start',
      }}
    />

    <DataMind size="sm" className="enter-7 enter-pop justify-self-end lg:col-start-2 lg:row-start-4 xl:col-start-3 xl:row-span-3 xl:row-start-1 xl:self-end" />
  </div>
)
