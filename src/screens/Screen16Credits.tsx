import { useId } from 'react'
import { Card } from '../components/ui/Card'
import { ExternalLink } from '../components/ui/ExternalLink'
import { screen16 as content, type MetaField } from '../content/screen16'

/** Official badge, if the author added it; otherwise a text badge is shown. */
const badgeUrl = Object.values(
  import.meta.glob<string>('../assets/brand/cc-by.svg', { eager: true, query: '?url', import: 'default' }),
)[0]

const renderValue = ({ value, link }: MetaField) => {
  if (!link || !value.includes(link.text)) return value
  const [before, after] = value.split(link.text)
  return (
    <>
      {before}
      <ExternalLink href={link.href}>{link.text}</ExternalLink>
      {after}
    </>
  )
}

export const Screen16Credits = () => {
  const metadataId = useId()
  const { metadata, license } = content
  const fields = metadata.fields.filter(field => field.value.trim() !== '')
  return (
    <div className="mx-auto grid min-h-full max-w-400 grid-cols-1 content-start gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,820fr)_minmax(0,580fr)] lg:gap-x-10 lg:py-8 xl:px-20">
      <h1 tabIndex={-1} className="text-h1 lg:col-span-2">{content.title}</h1>

      <Card as="section" aria-labelledby={metadataId} className="flex flex-col gap-3 p-6 lg:self-start xl:p-7">
        <h2 id={metadataId} className="text-h3">{metadata.title}</h2>
        <dl className="lg:columns-2 lg:gap-x-8">
          {fields.map(field => (
            <div key={field.label} className="break-inside-avoid border-t border-line py-3">
              <dt className="text-caption text-muted">{field.label}</dt>
              <dd className="text-small text-ink">{renderValue(field)}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <div className="flex flex-col gap-6 lg:self-start">
        <section aria-label={license.badgeAlt} className="on-dark flex flex-col items-start gap-4 rounded-card bg-ink p-6 xl:p-7">
          {badgeUrl
            ? <img src={badgeUrl} alt={license.badgeAlt} width={120} height={42} />
            : <span className="rounded-control border-2 border-white px-3 py-1.5 font-medium text-white">{license.badgeText}</span>}
          <p className="text-small text-line">{license.attribution}</p>
          <ExternalLink href={license.href} className="text-small font-medium text-white">{license.linkText}</ExternalLink>
        </section>
      </div>
    </div>
  )
}
