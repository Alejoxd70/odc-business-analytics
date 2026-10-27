import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import { Button } from '../ui/Button'
import { frame } from '../../content/frame'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import type { NavConfig } from '../../screens'

export type BottomBarProps = NavConfig & {
  audio: ReactNode
  onPrev: () => void
  onMenu: () => void
  onNext: () => void
}

export const BottomBar = ({ audio, showPrev, showMenu, menuCurrent, next, hint, onPrev, onMenu, onNext }: BottomBarProps) => {
  const size = useMediaQuery('(min-width: 768px)') ? 'md' : 'sm'
  const hasButtons = showPrev || showMenu || next

  return (
    <footer className="flex min-h-bottombar shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t-[1.5px] border-line bg-surface px-4 py-3 sm:px-8 xl:px-12">
      <div className="min-w-0">{audio}</div>
      <nav aria-label={frame.navLabel} className="ml-auto flex flex-wrap items-center justify-end gap-3">
        {showPrev && (
          <Button variant="secondary" size={size} iconLeft={ChevronLeft} onClick={onPrev}>{frame.prev}</Button>
        )}
        {showMenu && (
          <Button
            variant="secondary"
            size={size}
            iconLeft={Menu}
            onClick={onMenu}
            disabled={menuCurrent}
            aria-current={menuCurrent ? 'page' : undefined}
          >
            {frame.menu}
          </Button>
        )}
        {next && (
          <Button size={size} iconRight={ChevronRight} onClick={onNext}>{next.label ?? frame.next}</Button>
        )}
        {!hasButtons && hint && <p className="text-small text-muted">{hint}</p>}
      </nav>
    </footer>
  )
}
