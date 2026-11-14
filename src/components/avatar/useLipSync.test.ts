import { describe, expect, it } from 'vitest'
import { armLift } from './useLipSync'

describe('armLift', () => {
  it('keeps the arms down below the emphasis threshold', () => {
    expect(armLift(0)).toBe(0)
    expect(armLift(0.2)).toBe(0)
  })

  it('rises in proportion above the threshold', () => {
    expect(armLift(0.6)).toBeCloseTo(0.5)
    expect(armLift(1)).toBe(1)
  })

  it('never leaves the 0–1 range', () => {
    expect(armLift(-1)).toBe(0)
    expect(armLift(3)).toBe(1)
  })
})
