import type { ReactNode } from 'react'
import { frame } from '../../content/frame'

export type ExternalLinkProps = {
  href: string
  children: ReactNode
  /** Color and wrapping; defaults to data-deep for light surfaces. */
  className?: string
}

/** Link to an external site: new tab, announced to screen readers. */
export const ExternalLink = ({ href, children, className = 'text-data-deep' }: ExternalLinkProps) => (
  <a href={href} target="_blank" rel="noopener" className={`relative underline ${className}`}>
    {children}
    <span className="sr-only">{` ${frame.newTab}`}</span>
  </a>
)
