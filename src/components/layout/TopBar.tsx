import { frame } from '../../content/frame'

// Glob: the build does not fail while the logo is missing.
const logos = import.meta.glob<string>('../../assets/brand/logo-udec.*', {
  eager: true,
  query: '?url',
  import: 'default',
})
const logoUrl = Object.values(logos)[0]

export type TopBarProps = {
  current: number
  total: number
  showBrand: boolean
  /** The logo is a button that goes back to the cover. */
  onHome: () => void
}

export const TopBar = ({ current, total, showBrand, onHome }: TopBarProps) => (
  <header className="relative grid h-topbar shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b-[1.5px] border-line bg-surface px-4 sm:px-8 xl:px-12">
    <div className="flex items-center">
      {/* On the cover itself it is the current page: disabled, but it looks the same */}
      <button
        type="button"
        onClick={onHome}
        disabled={current === 1}
        aria-current={current === 1 ? 'page' : undefined}
        aria-label={frame.home}
        className="rounded-control transition-opacity hover:enabled:opacity-75"
      >
        {logoUrl
          ? <img src={logoUrl} alt="" className="h-11 w-auto" />
          : (
              <span className="flex h-11 w-37.5 items-center justify-center rounded-control border-[1.5px] border-dashed border-faint text-small text-muted">
                {frame.logoPlaceholder}
              </span>
            )}
      </button>
    </div>
    <p className={`hidden font-display text-[20px] italic sm:block ${showBrand ? '' : 'sm:invisible'}`}>
      {frame.brand}
    </p>
    {/* Progress through the 16 screens, drawn over the header's bottom border */}
    <div
      role="progressbar"
      aria-label={frame.progressLabel}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-valuetext={frame.progressText(current, total)}
      className="absolute inset-x-0 -bottom-[1.5px] h-0.75 bg-track"
    >
      <div
        className="h-full rounded-r-full bg-data transition-[width] duration-300 ease-out"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  </header>
)
