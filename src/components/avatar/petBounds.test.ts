import { describe, expect, it } from 'vitest'
import { clampOffset, type Box } from './petBounds'

const bounds: Box = { left: 0, top: 0, right: 1000, bottom: 600 }
// A 100 × 150 avatar whose place in the layout is the bottom-right corner.
const home: Box = { left: 880, top: 440, right: 980, bottom: 590 }

describe('clampOffset', () => {
  it('keeps an offset that fits', () => {
    expect(clampOffset({ x: -200, y: -100 }, home, bounds)).toEqual({ x: -200, y: -100 })
  })

  it('stops at each edge, leaving the margin', () => {
    expect(clampOffset({ x: 500, y: 500 }, home, bounds)).toEqual({ x: 16, y: 6 })
    expect(clampOffset({ x: -5000, y: -5000 }, home, bounds)).toEqual({ x: -876, y: -436 })
  })

  it('uses the margin it is given', () => {
    expect(clampOffset({ x: 500, y: 0 }, home, bounds, 0)).toEqual({ x: 20, y: 0 })
  })

  it('sticks to the start edge when the avatar is bigger than the bounds', () => {
    const small: Box = { left: 0, top: 0, right: 80, bottom: 600 }
    const wide: Box = { left: 10, top: 100, right: 110, bottom: 250 }
    expect(clampOffset({ x: 40, y: 0 }, wide, small).x).toBe(-6)
  })

  it('rounds to whole pixels', () => {
    expect(clampOffset({ x: -10.4, y: -20.6 }, home, bounds)).toEqual({ x: -10, y: -21 })
  })
})
