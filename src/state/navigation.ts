import { createContext, useContext } from 'react'
import { initialCrossword } from '../activities/crosswordLogic'
import { screens } from '../content/screens'

/**
 * Progress of one activity; null = not answered yet.
 * answers: one value per question. placements: item id -> category id. slots: item id per position.
 * checked: numbers (from 1) of the checked items of a checklist. completed: simulator switches.
 */
export type SimulatorState = {
  software: boolean
  remove: boolean
  rule: boolean
  reviewer: boolean
  completed: boolean
}

/**
 * Final crossword. letters: "row,col" -> letter. results and score: last check.
 * edited: words changed after the last check (their marks are hidden until the next one).
 * bestScore only grows and passed never goes back to false (for SCORM).
 */
export type CrosswordState = {
  letters: Record<string, string>
  checked: boolean
  results: Record<number, boolean> | null
  score: number | null
  edited: number[]
  bestScore: number
  attempts: number
  passed: boolean
}

export type ActivityState
  = | { answers: (string | null)[] }
    | { placements: Record<string, number | null> }
    | { slots: (string | null)[] }
    | { checked: number[] }
    | SimulatorState
    | CrosswordState

/** Serializable state: it will be persisted to SCORM later. */
export type NavState = {
  current: number
  visited: number[]
  /** Activity progress, keyed by activity id (e.g. "s05"). */
  activities: Record<string, ActivityState>
  /** Where the user dragged DataMind on each screen, in px from its place in the layout. */
  avatarOffsets?: Record<number, AvatarOffset>
  /** Screens whose audio has already played: it starts by itself only on the first visit. */
  audioHeard?: number[]
}

export type AvatarOffset = { x: number, y: number }

export type NavAction
  = | { type: 'goTo', screen: number }
    | { type: 'next' }
    | { type: 'prev' }
    | { type: 'goToMenu' }
    | { type: 'setActivity', id: string, state: ActivityState }
    | { type: 'setAvatarOffset', screen: number, offset: AvatarOffset | null }
    | { type: 'markAudioHeard', screen: number }

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
    case 'setAvatarOffset': {
      // null: back to its place in the layout, so the entry is removed
      const offsets = { ...state.avatarOffsets }
      if (action.offset) offsets[action.screen] = action.offset
      else delete offsets[action.screen]
      return { ...state, avatarOffsets: offsets }
    }
    case 'markAudioHeard': {
      const heard = state.audioHeard ?? []
      return heard.includes(action.screen) ? state : { ...state, audioHeard: [...heard, action.screen] }
    }
  }
}

export type NavigationValue = {
  state: NavState
  goTo: (screen: number) => void
  next: () => void
  prev: () => void
  goToMenu: () => void
  setActivity: (id: string, state: ActivityState) => void
  setAvatarOffset: (screen: number, offset: AvatarOffset | null) => void
  markAudioHeard: (screen: number) => void
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

/** Item placed in each position of a sequence activity, plus a setter for one position. */
export const useSlots = (id: string, size: number) => {
  const { state, setActivity } = useNavigation()
  const stored = state.activities[id]
  const slots = stored && 'slots' in stored ? stored.slots : Array<string | null>(size).fill(null)
  const fill = (index: number, itemId: string) =>
    setActivity(id, { slots: slots.map((slot, i) => (i === index ? itemId : slot)) })
  return [slots, fill] as const
}

/** Checked items of a checklist (numbered from 1), plus a toggle for one item. */
export const useChecked = (id: string) => {
  const { state, setActivity } = useNavigation()
  const stored = state.activities[id]
  const checked = stored && 'checked' in stored && Array.isArray(stored.checked) ? stored.checked : []
  const toggle = (item: number) => setActivity(id, {
    checked: checked.includes(item)
      ? checked.filter(n => n !== item)
      : [...checked, item].sort((a, b) => a - b),
  })
  return [checked, toggle] as const
}

const initialSimulator: SimulatorState = { software: false, remove: false, rule: false, reviewer: false, completed: false }

/** Switches of a simulator activity, plus a setter that merges a partial change. */
export const useSimulator = (id: string) => {
  const { state, setActivity } = useNavigation()
  const stored = state.activities[id]
  const simulator = stored && 'completed' in stored ? stored : initialSimulator
  const update = (change: Partial<SimulatorState>) => setActivity(id, { ...simulator, ...change })
  return [simulator, update] as const
}

/** Crossword state, plus a setter that replaces it. */
export const useCrossword = (id: string) => {
  const { state, setActivity } = useNavigation()
  const stored = state.activities[id]
  const crossword = stored && 'letters' in stored ? stored : initialCrossword
  const set = (next: CrosswordState) => setActivity(id, next)
  return [crossword, set] as const
}
