import { useEffect, useRef } from 'react'
import { AudioControl } from '../audio/AudioControl'
import { DataMind } from '../avatar/DataMind'
import { BottomBar } from './BottomBar'
import { TopBar } from './TopBar'
import { frame } from '../../content/frame'
import { screens } from '../../content/screens'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { AVATAR_NARROW_PLACE, getNavConfig, screenEntries } from '../../screens'
import { TOTAL_SCREENS, useNavigation } from '../../state/navigation'

export const AppFrame = () => {
  const { state, next, prev, goToMenu } = useNavigation()
  // DataMind: small in a corner below 1024 px, medium up to 1279 px and large from 1280 px,
  // in each screen's own spot from 1024 px (screens/index.ts).
  const wide = useMediaQuery('(min-width: 1024px)')
  const large = useMediaQuery('(min-width: 1280px)')
  const { current } = state
  const meta = screens[current - 1]
  const entry = screenEntries[current]
  const mainRef = useRef<HTMLElement>(null)
  const shownScreen = useRef(current)

  useEffect(() => {
    document.title = frame.documentTitle(meta.label)
    // Only when the screen changes (not on mount, nor on StrictMode's double effect).
    if (shownScreen.current === meta.number) return
    shownScreen.current = meta.number
    const main = mainRef.current
    if (!main) return
    main.scrollTop = 0
    main.querySelector<HTMLElement>('h1')?.focus()
  }, [meta])

  return (
    <div className="flex h-dvh flex-col">
      <TopBar current={current} total={TOTAL_SCREENS} showBrand={current !== 1} />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <main ref={mainRef} className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          {entry && <entry.Component />}
        </main>
        {/* DataMind floats over the content, outside the scrolling <main>: it is always in
            view and never pushes the layout. Its spot on each screen comes from screens/index.ts. */}
        {meta.hasAvatar && (
          <div data-pet-bounds className="pointer-events-none absolute inset-0 overflow-hidden">
            <DataMind
              key={current}
              size={large ? 'lg' : wide ? 'md' : 'sm'}
              // Narrow corner by default; the screen's lg:/xl:/2xl: classes take over from 1024 px.
              // DataMind's entrance is longer and softer than the content's, so it glides in
              // instead of popping up (the screen's `enter` sets only its step and direction).
              className={`pointer-events-auto absolute z-10 ${AVATAR_NARROW_PLACE} ${entry?.avatar?.place ?? ''} ${entry?.avatar?.enter ?? ''} [--enter-duration:700ms] [--enter-ease:cubic-bezier(0.33,1,0.68,1)]`}
            />
          </div>
        )}
      </div>
      <BottomBar
        {...getNavConfig(current)}
        audio={meta.audio && <AudioControl key={current} file={meta.audio} transcript={entry?.transcript} />}
        onPrev={prev}
        onMenu={goToMenu}
        onNext={next}
      />
    </div>
  )
}
