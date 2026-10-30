import type { ReactNode } from 'react'
import { frame } from '../../content/frame'

export type FeedbackResult = 'correct' | 'review'

export type FeedbackProps = {
  /** null renders the (empty) live region only. */
  result: FeedbackResult | null
  children?: ReactNode
  /** false: no live region (the parent announces the change itself). */
  live?: boolean
}

const styles: Record<FeedbackResult, { box: string, prefix: string }> = {
  correct: { box: 'bg-data-soft text-data-deep', prefix: frame.correctPrefix },
  review: { box: 'bg-alert-soft text-alert-deep', prefix: frame.reviewPrefix },
}

/**
 * Activity feedback ("Correcto." / "Revisa."). The aria-live region is always
 * rendered so screen readers announce the first message too.
 */
export const Feedback = ({ result, children, live = true }: FeedbackProps) => (
  <div aria-live={live ? 'polite' : undefined} aria-atomic={live || undefined}>
    {result && (
      <p className={`rounded-control px-4 py-3 text-small ${styles[result].box}`}>
        <span className="font-medium">{styles[result].prefix}</span>
        {' '}
        {children}
      </p>
    )}
  </div>
)
