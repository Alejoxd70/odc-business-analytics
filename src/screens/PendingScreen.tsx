import { DataMind } from '../components/avatar/DataMind'
import { frame } from '../content/frame'
import type { ScreenMeta } from '../content/screens'

/** Placeholder for screens not built yet: lets the whole navigation be tested. */
export const PendingScreen = ({ meta }: { meta: ScreenMeta }) => (
  <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center gap-8 px-4 py-10 text-center">
    <h1 tabIndex={-1} className="text-h2 md:text-h1">
      {`Pantalla ${meta.number}: ${meta.label} ${frame.pending}`}
    </h1>
    {meta.hasAvatar && <DataMind size="sm" />}
  </div>
)
