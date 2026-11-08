import { useId, type ReactNode } from 'react'
import { Card } from '../components/ui/Card'
import { ExternalLink } from '../components/ui/ExternalLink'
import { references as content } from '../content/references'

const TOKEN = /(\*[^*]+\*|https?:\/\/\S+)/

/** APA text with *italics* and a trailing DOI/URL turned into <em> and a link. */
const renderReference = (text: string): ReactNode[] =>
  text.split(TOKEN).filter(Boolean).map((part, index) => {
    const key = `${index}-${part}`
    if (part.startsWith('*') && part.endsWith('*')) return <em key={key}>{part.slice(1, -1)}</em>
    if (/^https?:\/\//.test(part)) {
      return <ExternalLink key={key} href={part} className="text-data-deep wrap-anywhere">{part}</ExternalLink>
    }
    return part
  })

export const Screen15References = () => {
  const titleId = useId()
  return (
    <div className="mx-auto flex min-h-full max-w-400 flex-col gap-6 px-4 py-10 sm:px-8 lg:h-full lg:min-h-0 lg:py-8 xl:px-20">
      <h1 id={titleId} tabIndex={-1} className="enter-0 enter-from-start text-h1">{content.title}</h1>
      {/* Scrollable region: focusable so it can be scrolled with the keyboard */}
      <Card
        as="section"
        aria-labelledby={titleId}
        tabIndex={0}
        className="enter-1 enter-rise relative px-5 py-2 sm:px-7 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
      >
        {/* The whole list comes into focus: the item count varies, so no per-item steps */}
        <ul className="enter-3 enter-blur list-none">
          {content.items.map(item => (
            <li key={item} className="border-t border-line py-3 pl-7 -indent-7 text-small first:border-t-0">
              {renderReference(item)}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
