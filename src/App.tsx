import { lazy, Suspense, useSyncExternalStore } from 'react'
import { AppFrame } from './components/layout/AppFrame'
import { AudioStateProvider } from './state/AudioStateProvider'
import { NavigationProvider } from './state/NavigationProvider'

// Development only: in production import.meta.env.DEV is false and the chunk is dropped.
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
