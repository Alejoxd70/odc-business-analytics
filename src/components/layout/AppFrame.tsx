import { useEffect, useRef } from 'react'
import { AudioControl } from '../audio/AudioControl'
import { BottomBar } from './BottomBar'
import { TopBar } from './TopBar'
import { frame } from '../../content/frame'
import { screens } from '../../content/screens'
import { getNavConfig, screenEntries } from '../../screens'
import { PantallaPendiente } from '../../screens/PantallaPendiente'
import { TOTAL_SCREENS, useNavigation } from '../../state/navigation'

export const AppFrame = () => {
  const { state, next, prev, goToMenu } = useNavigation()
  const { current } = state
  const meta = screens[current - 1]
  const entry = screenEntries[current]
  const mainRef = useRef<HTMLElement>(null)
  const shownScreen = useRef(current)

  useEffect(() => {
    document.title = frame.documentTitle(meta.number, meta.label)
    // Solo al cambiar de pantalla (no al montar, ni en el doble efecto de StrictMode).
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
      <main ref={mainRef} className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        {entry ? <entry.Component /> : <PantallaPendiente meta={meta} />}
      </main>
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
