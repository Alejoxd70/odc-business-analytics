import { useEffect, useState } from 'react'
import { figureAt, splitFigure } from './countUpFormat'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export type CountUpProps = {
  /** The figure exactly as written in the content, e.g. "50,4%" or "≈ 3%". */
  text: string
  /** Wait before counting (ms): match it to the element's entrance step (enter-N × 70). */
  delay?: number
  duration?: number
}

const easeOut = (t: number) => 1 - (1 - t) ** 3

/**
 * A figure that counts up from zero to its value once, when the screen enters.
 * Screen readers get the real figure from the start, and the final text keeps its place
 * while counting, so nothing around it moves. With reduced motion it does not count.
 */
export const CountUp = ({ text, delay = 0, duration = 900 }: CountUpProps) => {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const parts = splitFigure(text)
  const counts = parts !== null && parts.value > 0 && !reducedMotion
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!counts) return
    let frame = 0
    let start: number | null = null
    const tick = (now: number) => {
      start ??= now + delay
      const t = Math.min(Math.max((now - start) / duration, 0), 1)
      setProgress(easeOut(t))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [counts, delay, duration])

  if (!counts || progress >= 1) return text

  return (
    <span className="inline-grid">
      {/* Invisible final text: reserves the width. Neither copy below is read aloud. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">{text}</span>
      <span aria-hidden="true" className="col-start-1 row-start-1">{figureAt(parts, progress)}</span>
      <span className="sr-only">{text}</span>
    </span>
  )
}
