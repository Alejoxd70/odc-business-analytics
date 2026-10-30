import { createContext, useContext } from 'react'
import { screens } from '../content/screens'

/**
 * Progress of one activity; null = not answered yet.
 * answers: one value per question. placements: item id -> category id.
 */
export type ActivityState
  = | { answers: (string | null)[] }
    | { placements: Record<string, number | null> }

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
  const stored = state.activities[id]
  const answers = stored && 'answers' in stored ? stored.answers : Array<string | null>(size).fill(null)
  const setAnswer = (index: number, value: string) =>
    setActivity(id, { answers: answers.map((answer, i) => (i === index ? value : answer)) })
  return [answers, setAnswer] as const
}

/** Where each item of a classify activity was placed, plus a setter (null = back to the list). */
export const usePlacements = (id: string, itemIds: string[]) => {
  const { state, setActivity } = useNavigation()
  const stored = state.activities[id]
  const placements = stored && 'placements' in stored
    ? stored.placements
    : Object.fromEntries(itemIds.map(itemId => [itemId, null]))
  const place = (itemId: string, category: number | null) =>
    setActivity(id, { placements: { ...placements, [itemId]: category } })
  return [placements, place] as const
}
