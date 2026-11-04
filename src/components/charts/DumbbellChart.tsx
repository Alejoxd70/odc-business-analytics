export type DumbbellItem = {
  label: string
  /** Percentages, 0 to 100. */
  before: number
  after: number
}

export type DumbbellChartProps = {
  items: DumbbellItem[]
  legend: { before: string, after: string }
  /** Screen reader text of a row value, e.g. "De 54% antes a 72% después". */
  srValue: (before: number, after: number) => string
  /** Connector between both values, e.g. "a". */
  connector: string
  className?: string
}

const percent = (value: number) => `${value}%`

/**
 * Change between a "before" and an "after" value per row. Values are always
 * written as text; the track, segment and dots are decorative.
 */
export const DumbbellChart = ({ items, legend, srValue, connector, className = '' }: DumbbellChartProps) => (
  <div className={`flex flex-col gap-3 ${className}`}>
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-caption text-muted">
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-rule-strong" />
        {legend.before}
      </li>
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-data" />
        {legend.after}
      </li>
    </ul>

    <ul>
      {items.map(item => (
        <li key={item.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-t border-line py-3.5 sm:grid-cols-[210px_minmax(0,1fr)_auto]">
          <span className="col-span-2 text-small sm:col-span-1">{item.label}</span>
          {/* Small decoration: absolute positions inside the track only */}
          <span aria-hidden="true" className="relative mx-2.5 h-4.5">
            <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-track" />
            <span
              className="absolute top-1/2 h-1 -translate-y-1/2 bg-control"
              style={{ left: `${Math.min(item.before, item.after)}%`, width: `${Math.abs(item.after - item.before)}%` }}
            />
            <span
              className="absolute top-1/2 size-4 -translate-1/2 rounded-full border-2 border-white bg-rule-strong"
              style={{ left: `${item.before}%` }}
            />
            <span
              className="absolute top-1/2 size-4.5 -translate-1/2 rounded-full border-2 border-white bg-data"
              style={{ left: `${item.after}%` }}
            />
          </span>
          <span className="text-right text-small whitespace-nowrap">
            <span aria-hidden="true">
              <span className="text-muted">{percent(item.before)}</span>
              {' '}
              <span className="text-muted">{connector}</span>
              {' '}
              <span className="font-medium text-data">{percent(item.after)}</span>
            </span>
            <span className="sr-only">{srValue(item.before, item.after)}</span>
          </span>
        </li>
      ))}
    </ul>
  </div>
)
