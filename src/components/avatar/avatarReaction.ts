/** How DataMind reacts to an answer: it celebrates a right one and doubts a wrong one. */
export type AvatarReaction = 'cheer' | 'doubt'

type Listener = (reaction: AvatarReaction) => void

// A plain event channel, outside React and outside the store: a reaction is a passing
// gesture, not progress, so nothing is saved.
const listeners = new Set<Listener>()

/** Call from an event handler (an answer was just given), never while rendering. */
export const emitAvatarReaction = (reaction: AvatarReaction) => {
  listeners.forEach(listener => listener(reaction))
}

/** Subscribes to the reactions; returns the function that unsubscribes. */
export const onAvatarReaction = (listener: Listener) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
