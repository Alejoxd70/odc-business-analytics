import type { DataStateId } from '../../content/states'

/** Background and text color of each data state (staircase of screen 6, state pills). Full class names so Tailwind can detect them. */
export const stateTone: Record<DataStateId, { bg: string, text: string }> = {
  1: { bg: 'bg-state-1', text: 'text-ink' },
  2: { bg: 'bg-state-2', text: 'text-ink' },
  3: { bg: 'bg-state-3', text: 'text-ink' },
  4: { bg: 'bg-state-4', text: 'text-white' },
}
