import { frame } from '../../content/frame'

// Glob: el build no falla mientras el logo no exista.
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
}

export const TopBar = ({ current, total, showBrand }: TopBarProps) => (
  <header className="grid h-topbar shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b-[1.5px] border-line bg-surface px-4 sm:px-8 xl:px-12">
    <div className="flex items-center">
      {logoUrl
        ? <img src={logoUrl} alt={frame.logoAlt} className="h-11 w-auto" />
        : (
            <span className="flex h-11 w-37.5 items-center justify-center rounded-control border-[1.5px] border-dashed border-faint text-small text-muted">
              {frame.logoPlaceholder}
            </span>
          )}
    </div>
    <p className={`hidden font-display text-[20px] italic sm:block ${showBrand ? '' : 'sm:invisible'}`}>
      {frame.brand}
    </p>
    <p className="col-start-3 justify-self-end text-small whitespace-nowrap text-muted">
      {frame.counter(current, total)}
    </p>
  </header>
)
