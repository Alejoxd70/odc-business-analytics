import { useId } from 'react'

export type LedgerToChartProps = {
  alt: string
  notes: string[]
  className?: string
}

// Geometría en unidades del viewBox (640 × 440).
const sheet = { x: 2, y: 2, width: 300, height: 436 }
const marginX = 50
const firstRule = 64
const ruleGap = 35.5
const rules = Array.from({ length: 11 }, (_, i) => firstRule + i * ruleGap)

const baseY = 420
const bars = [
  { height: 58, opacity: 0.45 },
  { height: 92, opacity: 0.6 },
  { height: 126, opacity: 0.72 },
  { height: 172, opacity: 0.84 },
  { height: 222, opacity: 0.95 },
].map((bar, i) => ({ ...bar, x: 354 + i * 54, width: 34 }))
const trend = bars.map(b => ({ x: b.x + b.width / 2, y: baseY - b.height - 24 }))

export const LedgerToChart = ({ alt, notes, className = '' }: LedgerToChartProps) => {
  const titleId = useId()
  return (
    <svg
      viewBox="0 0 640 440"
      role="img"
      aria-labelledby={titleId}
      className={`h-auto w-full ${className}`}
    >
      <title id={titleId}>{alt}</title>

      {/* Hoja de cuaderno */}
      <rect {...sheet} rx={10} className="fill-surface stroke-rule" strokeWidth={1.5} />
      <line x1={marginX} y1={sheet.y} x2={marginX} y2={sheet.y + sheet.height} className="stroke-ledger-margin" strokeWidth={1.5} />
      {rules.map(y => (
        <line key={y} x1={14} y1={y} x2={sheet.x + sheet.width - 12} y2={y} className="stroke-rule" strokeWidth={1.2} />
      ))}
      {notes.map((note, i) => (
        <text
          key={note}
          x={marginX + 14}
          y={rules[i] - 7}
          fontSize={25}
          opacity={0.8}
          className="fill-ink font-hand"
        >
          {note}
        </text>
      ))}

      {/* Gráfico */}
      {[baseY - 120, baseY - 240].map(y => (
        <line key={y} x1={338} y1={y} x2={636} y2={y} className="stroke-line" strokeWidth={1.5} strokeDasharray="4 6" />
      ))}
      {bars.map(b => (
        <rect key={b.x} x={b.x} y={baseY - b.height} width={b.width} height={b.height} rx={2} fillOpacity={b.opacity} className="fill-data" />
      ))}
      <line x1={338} y1={baseY} x2={636} y2={baseY} className="stroke-ink" strokeWidth={2} />
      <polyline
        points={trend.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        className="stroke-signal"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {trend.map(p => (
        <circle key={p.x} cx={p.x} cy={p.y} r={5.5} className="fill-signal" />
      ))}
    </svg>
  )
}
