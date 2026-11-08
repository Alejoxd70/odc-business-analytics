export type HBarItem = {
  label: string
  value: number
  highlighted?: boolean
}

export type HBarChartProps = {
  /** Chart caption, e.g. the measured variable. */
  title: string
  items: HBarItem[]
  /** Upper end of the scale. */
  max: number
  className?: string
  /** Optional entrance classes for each bar, in item order (e.g. "enter-4 enter-draw-x"). */
  barEnter?: readonly string[]
}

const formatValue = (value: number) => value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Horizontal bars. Values are always written as text; the bars themselves are decorative. */
export const HBarChart = ({ title, items, max, className = '', barEnter }: HBarChartProps) => (
  <figure className={`flex flex-col gap-3 ${className}`}>
    <figcaption className="text-small text-muted">{title}</figcaption>
    <ul className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <li key={item.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[230px_minmax(0,1fr)_auto]">
          <span className="col-span-2 text-small sm:col-span-1">{item.label}</span>
          <span aria-hidden="true" className="h-4 overflow-hidden rounded-sm bg-track">
            <span
              className={`${barEnter?.[i] ?? ''} block h-full rounded-sm ${item.highlighted ? 'bg-data' : 'bg-rule-strong'}`}
              style={{ width: `${Math.min(item.value / max, 1) * 100}%` }}
            />
          </span>
          <span className={`min-w-11 text-right text-small tabular-nums ${item.highlighted ? 'font-medium' : ''}`}>
            {formatValue(item.value)}
          </span>
        </li>
      ))}
    </ul>
  </figure>
)
