import { useSyncExternalStore } from 'react'

/** true mientras la media query se cumpla, p. ej. useMediaQuery('(min-width: 768px)'). */
export const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
  )
