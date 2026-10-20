import { useState } from 'react'
import { CircleHelp, Play } from 'lucide-react'
import { DataMind } from '../components/avatar/DataMind'
import { LedgerToChart } from '../components/illustrations/LedgerToChart'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { pantalla01 as content } from '../content/pantalla01'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useNavigation } from '../state/navigation'

export const Pantalla01Portada = () => {
  const { goTo } = useNavigation()
  const [helpOpen, setHelpOpen] = useState(false)
  const wide = useMediaQuery('(min-width: 1280px)')

  return (
    <div className="mx-auto grid min-h-full max-w-360 grid-cols-1 content-center gap-x-12 gap-y-10 px-4 py-10 [grid-template-areas:'text'_'art'_'credits'] sm:px-8 md:grid-cols-2 md:[grid-template-areas:'text_art'_'credits_art'] xl:gap-x-16 xl:px-20 xl:py-14">
      <div className="flex max-w-160 flex-col gap-6 [grid-area:text]">
        <h1 tabIndex={-1} className="font-display text-h1 xl:text-display">{content.title}</h1>
        <p className="text-lead">{content.subtitle}</p>
        <p className="max-w-147.5 text-body text-muted">{content.description}</p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Button iconLeft={Play} onClick={() => goTo(2)}>{content.start}</Button>
          <Button variant="secondary" iconLeft={CircleHelp} aria-haspopup="dialog" onClick={() => setHelpOpen(true)}>
            {content.help}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 self-center [grid-area:art]">
        <LedgerToChart alt={content.illustrationAlt} notes={content.ledgerNotes} className="max-w-160" />
        <DataMind size={wide ? 'lg' : 'md'} className="self-end" />
      </div>

      <p className="flex flex-col text-small text-muted [grid-area:credits]">
        {content.credits.map(line => <span key={line}>{line}</span>)}
      </p>

      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)} title={content.helpDialog.title}>
        <p>{content.helpDialog.body}</p>
      </Dialog>
    </div>
  )
}
