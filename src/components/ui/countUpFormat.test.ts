import { describe, expect, it } from 'vitest'
import { figureAt, splitFigure } from './countUpFormat'

describe('splitFigure', () => {
  it('finds the number, its decimals and what surrounds it', () => {
    expect(splitFigure('125')).toEqual({ prefix: '', value: 125, decimals: 0, suffix: '' })
    expect(splitFigure('≈ 3%')).toEqual({ prefix: '≈ ', value: 3, decimals: 0, suffix: '%' })
    expect(splitFigure('50,4%')).toEqual({ prefix: '', value: 50.4, decimals: 1, suffix: '%' })
    expect(splitFigure('34 estudios')).toEqual({ prefix: '', value: 34, decimals: 0, suffix: ' estudios' })
  })

  it('takes only the first number', () => {
    expect(splitFigure('0 de 240')).toEqual({ prefix: '', value: 0, decimals: 0, suffix: ' de 240' })
  })

  it('returns null without a number', () => {
    expect(splitFigure('sin dato')).toBeNull()
  })
})

describe('figureAt', () => {
  const parts = splitFigure('≈ 50,4%')!

  it('ends exactly on the original text', () => {
    expect(figureAt(parts, 1)).toBe('≈ 50,4%')
    expect(figureAt(splitFigure('3,5 %')!, 1)).toBe('3,5 %')
  })

  it('keeps the shape on the way up', () => {
    expect(figureAt(parts, 0)).toBe('≈ 0,0%')
    expect(figureAt(parts, 0.5)).toBe('≈ 25,2%')
  })

  it('stays inside the range', () => {
    expect(figureAt(parts, 2)).toBe('≈ 50,4%')
    expect(figureAt(parts, -1)).toBe('≈ 0,0%')
  })
})
