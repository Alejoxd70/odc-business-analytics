import { createContext, useContext } from 'react'
import { screens } from '../content/screens'

/** Estado serializable: más adelante se guardará en SCORM. */
export type NavState = {
  current: number
  visited: number[]
}

export type NavAction
  = | { type: 'goTo', screen: number }
    | { type: 'next' }
    | { type: 'prev' }
    | { type: 'goToMenu' }

export const TOTAL_SCREENS = screens.length
export const MENU_SCREEN = 3

export const initialNavState: NavState = { current: 1, visited: [1] }

const enter = (state: NavState, screen: number): NavState => {
  const target = Math.min(Math.max(Math.trunc(screen), 1), TOTAL_SCREENS)
  if (target === state.current) return state
  return {
    current: target,
    visited: state.visited.includes(target) ? state.visited : [...state.visited, target],
  }
}

export const navigationReducer = (state: NavState, action: NavAction): NavState => {
  switch (action.type) {
    case 'goTo': return enter(state, action.screen)
    case 'next': return enter(state, state.current + 1)
    case 'prev': return enter(state, state.current - 1)
    case 'goToMenu': return enter(state, MENU_SCREEN)
  }
}

export type NavigationValue = {
  state: NavState
  goTo: (screen: number) => void
  next: () => void
  prev: () => void
  goToMenu: () => void
}

export const NavigationContext = createContext<NavigationValue | null>(null)

export const useNavigation = () => {
  const value = useContext(NavigationContext)
  if (!value) throw new Error('useNavigation debe usarse dentro de <NavigationProvider>')
  return value
}
