import { useId } from 'react'
import { Target, Users, type LucideIcon } from 'lucide-react'
import { DataMind } from '../components/avatar/DataMind'
import { Card, type CardTone } from '../components/ui/Card'
import { pantalla02 as content } from '../content/pantalla02'

type EntryCardProps = {
  icon: LucideIcon
  iconBg: 'bg-data' | 'bg-ink'
  tone: CardTone
  heading: string
  headingNote?: string
  body: string
}

const EntryCard = ({ icon: Icon, iconBg, tone, heading, headingNote, body }: EntryCardProps) => {
  const headingId = useId()
  return (
    <Card as="section" tone={tone} aria-labelledby={headingId} className="flex flex-col gap-6 p-6 md:p-8 xl:p-9">
      <div className="flex items-center gap-4">
        <span className={`flex size-13.5 shrink-0 items-center justify-center rounded-full text-white ${iconBg}`}>
          <Icon size={26} aria-hidden="true" />
        </span>
        <h2 id={headingId} className="text-h2 text-ink">
          {heading}
          {headingNote && (
            <>
              {' '}
              <span className="text-muted">{headingNote}</span>
            </>
          )}
        </h2>
      </div>
      <p className="text-body text-ink">{body}</p>
    </Card>
  )
}

export const Pantalla02PrimeraEntrada = () => (
  <div className="mx-auto flex min-h-full max-w-360 flex-col justify-center gap-10 px-4 py-10 sm:px-8 xl:px-20">
    <h1 tabIndex={-1} className="sr-only">{content.srTitle}</h1>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-10">
      <EntryCard
        icon={Target}
        iconBg="bg-data"
        tone="surface"
        heading={content.outcome.heading}
        headingNote={content.outcome.headingNote}
        body={content.outcome.body}
      />
      <EntryCard
        icon={Users}
        iconBg="bg-ink"
        tone="soft"
        heading={content.audience.heading}
        body={content.audience.body}
      />
    </div>
    <DataMind size="md" className="self-center" />
  </div>
)
