import { useState } from 'react'
import { CircleHelp, Play } from 'lucide-react'
import { LedgerToChart } from '../components/illustrations/LedgerToChart'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { screen01 as content } from '../content/screen01'
import { useNavigation } from '../state/navigation'

export const Screen01Cover = () => {
  const { goTo } = useNavigation()
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <div className="mx-auto grid min-h-full max-w-360 grid-cols-1 content-center gap-x-12 gap-y-10 px-4 py-10 [grid-template-areas:'text'_'art'_'credits'] sm:px-8 md:grid-cols-2 md:[grid-template-areas:'text_art'_'credits_art'] xl:gap-x-16 xl:px-20 xl:py-14">
      <div className="flex max-w-160 flex-col gap-6 [grid-area:text]">
        <h1 tabIndex={-1} className="enter-0 font-display text-h1 xl:text-display">{content.title}</h1>
        <p className="enter-1 text-lead">{content.subtitle}</p>
        <p className="enter-2 max-w-147.5 text-body text-muted">{content.description}</p>
        <div className="enter-3 flex flex-wrap gap-4 pt-2">
          <Button iconLeft={Play} onClick={() => goTo(2)}>{content.start}</Button>
          <Button variant="secondary" iconLeft={CircleHelp} aria-haspopup="dialog" onClick={() => setHelpOpen(true)}>
            {content.help}
          </Button>
        </div>
      </div>

      <LedgerToChart alt={content.illustrationAlt} notes={content.ledgerNotes} className="enter-4 enter-from-end max-w-160 self-center [grid-area:art]" />

      <p className="enter-7 flex flex-col text-small text-muted [grid-area:credits]">
        {content.credits.map(line => <span key={line}>{line}</span>)}
      </p>

      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)} title={content.helpDialog.title}>
        <p>{content.helpDialog.body}</p>
      </Dialog>
    </div>
  )
}
