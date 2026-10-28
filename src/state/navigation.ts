import { createContext, useContext } from 'react'
import { screens } from '../content/screens'

/** Answers of one activity; null = not answered yet. */
export type ActivityState = {
  answers: (string | null)[]
}

/** Serializable state: it will be persisted to SCORM later. */
export type NavState = {
  current: number
  visited: number[]
  /** Activity progress, keyed by activity id (e.g. "s05"). */
  activities: Record<string, ActivityState>
}

export type NavAction
  = | { type: 'goTo', screen: number }
    | { type: 'next' }
    | { type: 'prev' }
    | { type: 'goToMenu' }
    | { type: 'setActivity', id: string, state: ActivityState }

export const TOTAL_SCREENS = screens.length
export const MENU_SCREEN = 3

export const initialNavState: NavState = { current: 1, visited: [1], activities: {} }

const enter = (state: NavState, screen: number): NavState => {
  const target = Math.min(Math.max(Math.trunc(screen), 1), TOTAL_SCREENS)
  if (target === state.current) return state
  return {
    ...state,
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
    case 'setActivity': return { ...state, activities: { ...state.activities, [action.id]: action.state } }
  }
}

export type NavigationValue = {
  state: NavState
  goTo: (screen: number) => void
  next: () => void
  prev: () => void
  goToMenu: () => void
  setActivity: (id: string, state: ActivityState) => void
}

export const NavigationContext = createContext<NavigationValue | null>(null)

export const useNavigation = () => {
  const value = useContext(NavigationContext)
  if (!value) throw new Error('useNavigation must be used within <NavigationProvider>')
  return value
}

/** Answers of an activity stored in the global state, plus a setter for one answer. */
export const useActivity = (id: string, size: number) => {
  const { state, setActivity } = useNavigation()
  const answers = state.activities[id]?.answers ?? Array<string | null>(size).fill(null)
  const setAnswer = (index: number, value: string) =>
    setActivity(id, { answers: answers.map((answer, i) => (i === index ? value : answer)) })
  return [answers, setAnswer] as const
}
