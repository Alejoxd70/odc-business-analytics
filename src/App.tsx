import { lazy, Suspense, useSyncExternalStore } from 'react'

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
    <main className="flex min-h-dvh items-center justify-center px-4">
      <h1 className="text-h1">ODC en construcción</h1>
    </main>
  )
}

export default App
