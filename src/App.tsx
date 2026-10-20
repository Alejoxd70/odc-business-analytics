import { lazy, Suspense, useSyncExternalStore } from 'react'
import { AppFrame } from './components/layout/AppFrame'
import { AudioStateProvider } from './state/AudioStateProvider'
import { NavigationProvider } from './state/NavigationProvider'

// Solo en desarrollo: en producción import.meta.env.DEV es false y el chunk se elimina.
const StyleGuide = import.meta.env.DEV ? lazy(() => import('./dev/StyleGuide')) : null

const subscribeHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}
const getHash = () => window.location.hash

function App() {
  const hash = useSyncExternalStore(subscribeHash, getHash)

  if (StyleGuide && hash === '#guia') {
    return (
      <Suspense fallback={null}>
        <StyleGuide />
      </Suspense>
    )
  }

  return (
    <NavigationProvider>
      <AudioStateProvider>
        <AppFrame />
      </AudioStateProvider>
    </NavigationProvider>
  )
}

export default App
