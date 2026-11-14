import { useId, useState } from 'react'
import { Card } from '../components/ui/Card'
import { emitAvatarReaction } from '../components/avatar/avatarReaction'
import { Feedback } from '../components/ui/Feedback'
import { frame } from '../content/frame'
import type { screen12 } from '../content/screen12'
import { useSimulator, type SimulatorState } from '../state/navigation'

export type MeasureId = 'software' | 'remove' | 'rule' | 'reviewer'
export type ReliabilityLevel = 'low' | 'medium' | 'high'

type SimulatorText = typeof screen12.simulator
type Day = SimulatorText['days'][number]
type DayView = { kind: 'real' | 'rejected', value: number, flagged: boolean } | { kind: 'gap' }

export type MonitoringSimulatorProps = {
  /** Key of the activity in the global state (e.g. "s12"). */
  id: string
  text: SimulatorText
  className?: string
}

/** How an inconsistent day (recorded as "rejected") is drawn, in this order: removed, fixed by the rule, or as recorded. */
const dayView = (day: Day, s: SimulatorState): DayView => {
  if (day.rejected === undefined) return { kind: 'real', value: day.real, flagged: false }
  if (s.remove) return { kind: 'gap' }
  if (s.rule) return { kind: 'real', value: day.real, flagged: false }
  return { kind: 'rejected', value: day.rejected, flagged: s.reviewer }
}

/** Reliability of the dashboard. Buying software never changes it: that is the point. */
const reliability = (s: SimulatorState): { level: ReliabilityLevel, text: keyof SimulatorText['levelText'] } => {
  if (s.remove) return { level: 'low', text: 'removed' }
  if (!s.rule) return { level: 'low', text: 'mixed' }
  if (!s.reviewer) return { level: 'medium', text: 'medium' }
  return { level: 'high', text: 'high' }
}

const formatValue = (value: number) => value.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

// Full class names so Tailwind can detect them.
const levelFill: Record<ReliabilityLevel, string> = { low: 'bg-alert', medium: 'bg-ink', high: 'bg-data' }

/** Width of an element, kept up to date with ResizeObserver. */
const useWidth = () => {
  const [width, setWidth] = useState(0)
  const ref = (element: HTMLDivElement | null) => {
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }
  return [ref, width] as const
}

const CHART = { height: 230, top: 36, bottom: 26, left: 34, right: 6, max: 6, ticks: [0, 2, 4, 6] }

/** Bar chart drawn in real pixels, so its text keeps its size at any width. Decorative: a table carries the data. */
const BarChart = ({ views, text }: { views: DayView[], text: SimulatorText }) => {
  const [ref, width] = useWidth()
  const plotHeight = CHART.height - CHART.top - CHART.bottom
  const slot = (width - CHART.left - CHART.right) / views.length
  const barWidth = Math.min(slot * 0.58, 44)
  const y = (value: number) => CHART.top + plotHeight * (1 - value / CHART.max)
  const centerX = (index: number) => CHART.left + slot * (index + 0.5)
  const short = width < 560

  return (
    // The height is reserved before the width is known, so the card does not grow on mount.
    <div ref={ref} className="w-full" style={{ height: CHART.height }}>
      {width > 0 && (
        <svg aria-hidden="true" width={width} height={CHART.height} className="group/chart block overflow-visible">
          {CHART.ticks.map(tick => (
            <g key={tick}>
              <line x1={CHART.left} x2={width - CHART.right} y1={y(tick)} y2={y(tick)} className={tick === 0 ? 'stroke-ink' : 'stroke-line'} />
              <text x={CHART.left - 6} y={y(tick) + 4} textAnchor="end" className="fill-muted text-caption">{`${tick}%`}</text>
            </g>
          ))}
          {views.map((view, index) => {
            const x = centerX(index)
            const dayNumber = index + 1
            return (
              <g key={dayNumber} className="group/row">
                {view.kind === 'gap'
                  ? (
                      <>
                        <rect
                          x={x - barWidth / 2 + 1}
                          y={y(2)}
                          width={barWidth - 2}
                          height={y(0) - y(2)}
                          rx={3}
                          strokeDasharray="4 3"
                          strokeWidth={1.5}
                          className="fill-none stroke-control"
                        />
                        <text x={x} y={y(2) - 6} textAnchor="middle" className="fill-muted text-caption">—</text>
                      </>
                    )
                  : (
                      <>
                        <rect
                          x={x - barWidth / 2}
                          width={barWidth}
                          rx={3}
                          style={{ y: y(view.value), height: y(0) - y(view.value) }}
                          className={`transition-[y,height,opacity] duration-200 group-hover/chart:opacity-45 group-hover/row:opacity-100! ${view.kind === 'real' ? 'fill-data' : 'fill-rule-strong'}`}
                        />
                        {/* CSS "y" does not apply to <text>: the label moves with a transform, in step with the bar */}
                        <g style={{ transform: `translate(${x}px, ${y(view.value)}px)` }} className="transition-transform duration-200">
                          <text y={-6} textAnchor="middle" className="fill-ink-soft text-caption">{formatValue(view.value)}</text>
                          {view.flagged && (
                            <g transform="translate(0 -36)">
                              <polygon points="0,0 8,13 -8,13" className="fill-signal" />
                              <text y={11.5} textAnchor="middle" className="fill-ink text-[10px] font-semibold">!</text>
                            </g>
                          )}
                        </g>
                      </>
                    )}
                <text x={x} y={CHART.height - 6} textAnchor="middle" className="fill-muted text-caption">
                  {short ? text.dayShort(dayNumber) : text.dayLabel(dayNumber)}
                </text>
              </g>
            )
          })}
        </svg>
      )}
    </div>
  )
}

/**
 * Switch measures on and off and watch the dashboard of a sewing workshop.
 * Only a common recording rule plus someone who reviews the sheet makes it reliable.
 */
export const MonitoringSimulator = ({ id, text, className = '' }: MonitoringSimulatorProps) => {
  const titleId = useId()
  const [state, update] = useSimulator(id)
  /** Measure switched on last; its feedback is shown until something else changes. */
  const [lastOn, setLastOn] = useState<MeasureId | null>(null)

  const views = text.days.map(day => dayView(day, state))
  const { level, text: levelTextKey } = reliability(state)
  const drops = views.filter(view => view.kind === 'rejected').length
  const flagged = views.filter(view => view.kind === 'rejected' && view.flagged).length
  const lost = views.filter(view => view.kind === 'gap').length

  const toggle = (measure: MeasureId) => {
    const next = { ...state, [measure]: !state[measure] }
    const reachedHigh = reliability(next).level === 'high'
    const completed = state.completed || reachedHigh
    if (reachedHigh && level !== 'high') emitAvatarReaction('cheer')
    update({ [measure]: next[measure], completed })
    setLastOn(next[measure] ? measure : null)
  }

  // Feedback shown now: the closing one at high reliability, otherwise the measure switched on last.
  const current: MeasureId | 'closing' | null = level === 'high' ? 'closing' : lastOn
  const messages = [
    ...text.measures.map(measure => ({ key: measure.id, result: 'neutral' as const, text: measure.feedback })),
    { key: 'closing' as const, result: 'correct' as const, text: text.closingFeedback },
  ]
  const currentMessage = messages.find(message => message.key === current)
  const srMessage = currentMessage
    ? `${currentMessage.result === 'correct' ? `${frame.correctPrefix} ` : ''}${currentMessage.text}`
    : ''

  return (
    <Card as="section" aria-labelledby={titleId} className={`flex flex-col gap-4 p-5 sm:p-6 xl:p-7 ${className}`}>
      <div className="flex flex-col gap-1">
        <h2 id={titleId} className="text-h3">{text.title}</h2>
        <p className="text-small text-ink-soft">{text.instruction}</p>
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-caption text-muted">
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-xs bg-data" />
          {text.legend.real}
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-xs bg-rule-strong" />
          {text.legend.rejected}
        </li>
        <li className="flex items-center gap-1.5">
          <svg aria-hidden="true" width="12" height="11" viewBox="0 0 16 14" className="fill-signal">
            <polygon points="8,0 16,14 0,14" />
          </svg>
          {text.legend.flagged}
        </li>
      </ul>

      {/* Same box in every state: only the background changes, and the pill floats over the chart's empty top band */}
      <div className={`relative flex flex-col gap-1 rounded-control p-3 transition-[background-color] ${state.software ? 'bg-paper' : ''}`}>
        {state.software && (
          <span className="absolute top-3 right-3 rounded-full border-[1.5px] border-line bg-surface px-2.5 py-0.5 text-caption font-medium text-ink-soft">
            {text.newDashboard}
          </span>
        )}
        <BarChart views={views} text={text} />
        <p className="min-h-lh text-caption text-muted">{lost > 0 && text.lostDays(lost, views.length)}</p>
      </div>

      {/* sr-only on a wrapper: on the table itself some browsers still paint its caption */}
      <div className="sr-only">
        <table>
          <caption>{text.table.caption}</caption>
          <thead>
            <tr>
              <th scope="col">{text.table.day}</th>
              <th scope="col">{text.table.value}</th>
            </tr>
          </thead>
          <tbody>
            {views.map((view, index) => (
              <tr key={text.dayLabel(index + 1)}>
                <th scope="row">{text.dayLabel(index + 1)}</th>
                <td>
                  {view.kind === 'gap'
                    ? text.table.noData
                    : `${formatValue(view.value)} %${view.flagged ? `, ${text.table.flagged}` : ''}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p aria-live="polite" aria-atomic="true" className="sr-only">{text.summary(drops, flagged, lost, level)}</p>

      <div role="group" aria-label={text.meterLabel} className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p aria-hidden="true" className="text-small font-medium">{text.meterLabel}</p>
          <ul aria-hidden="true" className="flex gap-1.5">
            {(['low', 'medium', 'high'] as const).map(segment => (
              <li
                key={segment}
                className={`min-w-topbar rounded-control px-3 py-1 text-center text-caption font-medium transition-[background-color,color] ${
                  segment === level ? `${levelFill[segment]} text-white` : 'bg-track text-muted'
                }`}
              >
                {text.levels[segment]}
              </li>
            ))}
          </ul>
        </div>
        <p className="sr-only">{text.levelSr(level)}</p>
        {/* Every variant stacked in one cell: the cell keeps the height of the longest, so nothing jumps */}
        <div className="grid text-small text-ink-soft">
          {Object.entries(text.levelText).map(([key, value]) => (
            <p key={key} aria-hidden={key !== levelTextKey} className={`col-start-1 row-start-1 ${key === levelTextKey ? '' : 'invisible'}`}>
              {value}
            </p>
          ))}
        </div>
      </div>

      <ul className="grid gap-3 lg:grid-cols-2">
        {text.measures.map((measure) => {
          const on = state[measure.id]
          return (
            <li key={measure.id}>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => toggle(measure.id)}
                className={`flex h-full min-h-14 w-full items-center gap-3 rounded-control border-[1.5px] bg-surface px-4 py-2.5 text-left text-small transition-[border-color] hover:border-data ${on ? 'border-data' : 'border-line'}`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-11 shrink-0 items-center rounded-full border-[1.5px] px-0.5 transition-[background-color,border-color] ${on ? 'border-data bg-data' : 'border-control bg-surface'}`}
                >
                  <span className={`size-4 rounded-full transition-transform duration-200 ${on ? 'translate-x-5 bg-white' : 'bg-control'}`} />
                </span>
                {measure.label}
              </button>
            </li>
          )
        })}
      </ul>

      {/* Visual feedback: all messages stacked in one cell, only the current one visible, so the area never changes height */}
      <div aria-hidden="true" className="grid">
        {messages.map(message => (
          <div key={message.key} className={`col-start-1 row-start-1 ${message.key === current ? '' : 'invisible'}`}>
            <Feedback live={false} result={message.result}>{message.text}</Feedback>
          </div>
        ))}
      </div>
      <p aria-live="polite" aria-atomic="true" className="sr-only">{srMessage}</p>
    </Card>
  )
}
