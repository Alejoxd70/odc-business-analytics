import { ClassifyActivity } from '../activities/ClassifyActivity'
import { modules } from '../content/modules'
import { screen07 as content } from '../content/screen07'

const moduleMeta = modules[1]

// Entrance (literal classes, so Tailwind detects them): the cases slide in from the left
// while the four zones tip into place one after another.
const activityEnter = {
  cases: 'enter-3 enter-from-start',
  zones: ['enter-4 enter-tilt', 'enter-5 enter-tilt', 'enter-6 enter-tilt', 'enter-7 enter-tilt'],
}

export const Screen07Module2Classify = () => (
  <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-center gap-8 px-4 py-10 sm:px-8 xl:px-20">
    <div className="flex flex-col gap-2">
      <p className="enter-0 enter-from-start text-small font-medium text-data">{moduleMeta.label}</p>
      <h1 tabIndex={-1} className="enter-1 enter-blur text-h1">{content.title}</h1>
      <p className="enter-2 enter-blur text-body text-muted">{content.instruction}</p>
    </div>

    <ClassifyActivity id="s07" cases={content.cases} enter={activityEnter} />

  </div>
)
