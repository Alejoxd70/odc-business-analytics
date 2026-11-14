import { describe, expect, it } from 'vitest'
import { initialNavState, MENU_SCREEN, navigationReducer, TOTAL_SCREENS } from './navigation'

describe('navigation', () => {
  it('moves forward and back, recording each visited screen once', () => {
    const second = navigationReducer(initialNavState, { type: 'next' })
    expect(second.current).toBe(2)
    expect(second.visited).toEqual([1, 2])
    const first = navigationReducer(second, { type: 'prev' })
    expect(first.current).toBe(1)
    expect(first.visited).toEqual([1, 2])
  })

  it('stays inside the first and last screens', () => {
    expect(navigationReducer(initialNavState, { type: 'prev' })).toBe(initialNavState)
    const last = navigationReducer(initialNavState, { type: 'goTo', screen: 99 })
    expect(last.current).toBe(TOTAL_SCREENS)
    expect(navigationReducer(last, { type: 'next' })).toBe(last)
    expect(navigationReducer(last, { type: 'goTo', screen: -3 }).current).toBe(1)
  })

  it('goes to the menu from any screen', () => {
    const far = navigationReducer(initialNavState, { type: 'goTo', screen: 12 })
    expect(navigationReducer(far, { type: 'goToMenu' }).current).toBe(MENU_SCREEN)
  })
})

describe('setAvatarOffset', () => {
  it('stores one offset per screen', () => {
    const moved = navigationReducer(initialNavState, { type: 'setAvatarOffset', screen: 4, offset: { x: 10, y: -20 } })
    const both = navigationReducer(moved, { type: 'setAvatarOffset', screen: 5, offset: { x: 1, y: 2 } })
    expect(both.avatarOffsets).toEqual({ 4: { x: 10, y: -20 }, 5: { x: 1, y: 2 } })
  })

  it('removes the entry when the avatar goes back to its place', () => {
    const moved = navigationReducer(initialNavState, { type: 'setAvatarOffset', screen: 4, offset: { x: 10, y: -20 } })
    const home = navigationReducer(moved, { type: 'setAvatarOffset', screen: 4, offset: null })
    expect(home.avatarOffsets).toEqual({})
  })
})

describe('markAvatarHintSeen', () => {
  it('is set once and kept', () => {
    const seen = navigationReducer(initialNavState, { type: 'markAvatarHintSeen' })
    expect(seen.avatarHintSeen).toBe(true)
    expect(navigationReducer(seen, { type: 'markAvatarHintSeen' })).toBe(seen)
    expect(navigationReducer(seen, { type: 'next' }).avatarHintSeen).toBe(true)
  })
})

describe('markAudioHeard', () => {
  it('records each screen once', () => {
    const once = navigationReducer(initialNavState, { type: 'markAudioHeard', screen: 4 })
    expect(once.audioHeard).toEqual([4])
    expect(navigationReducer(once, { type: 'markAudioHeard', screen: 4 })).toBe(once)
  })

  it('keeps the screens already heard, also while navigating', () => {
    const heard = navigationReducer({ ...initialNavState, audioHeard: [1, 2] }, { type: 'markAudioHeard', screen: 3 })
    expect(heard.audioHeard).toEqual([1, 2, 3])
    expect(navigationReducer(heard, { type: 'next' }).audioHeard).toEqual([1, 2, 3])
  })
})
