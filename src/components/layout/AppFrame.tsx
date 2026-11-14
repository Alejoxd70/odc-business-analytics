import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AudioControl } from '../audio/AudioControl'
import { DataMind } from '../avatar/DataMind'
import { BottomBar } from './BottomBar'
import { TopBar } from './TopBar'
import { frame } from '../../content/frame'
import { keywords } from '../../content/keywords'
import { screens } from '../../content/screens'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { AVATAR_NARROW_PLACE, getNavConfig, screenEntries } from '../../screens'
import { TOTAL_SCREENS, useNavigation } from '../../state/navigation'

/** Elements that handle the arrow keys themselves: the screen shortcuts stay out of their way. */
const ARROW_KEY_USERS
  = 'input, textarea, select, [contenteditable], [role="button"], [role="switch"], [role="slider"], [aria-roledescription]'

/** Content hidden below the fold by less than this (px) does not count as "more below". */
const SCROLL_SLACK = 24

export const AppFrame = () => {
  const { state, next, prev, goTo, goToMenu, markAudioHeard } = useNavigation()
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

  // "There is more below": true while the content area can still scroll down.
  const [moreBelow, setMoreBelow] = useState(false)
  useEffect(() => {
    const main = mainRef.current
    if (!main) return
    // Measured on the screen itself, not on <main>: the space added for DataMind below
    // 1024 px is empty and must not count as content.
    const measure = () => {
      const screen = main.firstElementChild
      if (!screen) return
      setMoreBelow(screen.getBoundingClientRect().bottom - main.getBoundingClientRect().bottom > SCROLL_SLACK)
    }
    // The observer also fires once on observe(), which takes the first measure.
    const observer = new ResizeObserver(measure)
    observer.observe(main)
    if (main.firstElementChild) observer.observe(main.firstElementChild)
    main.addEventListener('scroll', measure, { passive: true })
    return () => {
      observer.disconnect()
      main.removeEventListener('scroll', measure)
    }
  }, [current])

  // Left / right arrows: previous / next screen, unless the focus is somewhere that uses
  // the arrows itself (fields, the crossword, drag and drop, DataMind) or a dialog is open.
  const nav = getNavConfig(current)
  const canPrev = nav.showPrev
  const canNext = nav.next !== null
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (document.querySelector('dialog[open]')) return
      if (event.target instanceof Element && event.target.closest(ARROW_KEY_USERS)) return
      if (event.key === 'ArrowLeft' && canPrev) prev()
      if (event.key === 'ArrowRight' && canNext) next()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [canPrev, canNext, prev, next])

  return (
    <div className="flex h-dvh flex-col">
      <TopBar current={current} total={TOTAL_SCREENS} showBrand={current !== 1} onHome={() => goTo(1)} />
      {/* screen-transition: this area fades out when the screen changes (index.css) */}
      <div className="screen-transition relative flex min-h-0 flex-1 flex-col">
        {/* Below 1024 px DataMind sits over the bottom-right corner: the extra space at the
            end lets the last controls scroll clear of it. */}
        <main
          ref={mainRef}
          className={`relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto ${meta.hasAvatar ? 'after:block after:h-36 lg:after:hidden' : ''}`}
        >
          {entry && <entry.Component />}
        </main>
        {/* Decorative hint that the content continues below; it goes away at the end.
            Keyboard and touch scrolling work as usual, so it is not a control. */}
        <div
          aria-hidden="true"
          data-more-below={moreBelow || undefined}
          className={`pointer-events-none absolute inset-x-0 bottom-0 flex h-16 items-end justify-center bg-linear-to-t from-paper to-transparent pb-2 transition-opacity duration-200 ${moreBelow ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="flex size-8 items-center justify-center rounded-full border-[1.5px] border-line bg-surface text-ink-soft">
            <ChevronDown size={18} />
          </span>
        </div>
        {/* DataMind floats over the content, outside the scrolling <main>: it is always in
            view and never pushes the layout. Its spot on each screen comes from screens/index.ts. */}
        {meta.hasAvatar && (
          <div data-pet-bounds className="pointer-events-none absolute inset-0 overflow-hidden">
            <DataMind
              key={current}
              keywords={keywords[current]}
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
        {...nav}
        audio={meta.audio && (
          <AudioControl
            key={current}
            file={meta.audio}
            transcript={entry?.transcript}
            // DataMind speaks by itself only on the first visit to each screen.
            autoPlay={!state.audioHeard?.includes(current)}
            onStarted={() => markAudioHeard(current)}
          />
        )}
        onPrev={prev}
        onMenu={goToMenu}
        onNext={next}
      />
    </div>
  )
}
