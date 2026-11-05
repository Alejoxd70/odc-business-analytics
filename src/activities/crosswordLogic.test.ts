import { describe, expect, it } from 'vitest'
import { screen13 } from '../content/screen13'
import { modulesPhrase } from '../content/screen13'
import {
  applyCheck,
  applyLetters,
  applyRetry,
  wordMark,
  buildGrid,
  cellKey,
  evaluate,
  gridToText,
  initialCrossword,
  modulesToReview,
  normalizeLetters,
  retryLetters,
  tabOrder,
  toCellLetter,
  wordCells,
  type CrosswordWord,
} from './crosswordLogic'

const words: CrosswordWord[] = screen13.crossword.words

/** Every answer typed into the grid. */
const solved = () => {
  const letters: Record<string, string> = {}
  for (const word of words) wordCells(word).forEach((key, i) => (letters[key] = word.answer[i]))
  return letters
}

/** Clears a word's cells that no other word uses. */
const withWrongWord = (letters: Record<string, string>, number: number, wrong: string) => {
  const word = words.find(w => w.number === number)!
  const next = { ...letters }
  wordCells(word).forEach((key, i) => (next[key] = wrong[i] ?? ''))
  return next
}

describe('grid built from the storyboard table', () => {
  const grid = buildGrid(words)

  it('matches the storyboard layout', () => {
    expect(gridToText(grid, 10, 12)).toEqual([
      '.RESPONSABLE',
      '..V.........',
      '.DIAGNOSTICO',
      '..D.........',
      '..EXCLUIR...',
      '..N.......P.',
      '..C.......A.',
      '..I.......G.',
      'FRAGMENTADO.',
      '..S.......S.',
    ])
  })

  it('has every crossing with the same letter in both words', () => {
    const crossings: [number, number, string][] = [[0, 2, 'E'], [2, 2, 'I'], [4, 2, 'E'], [8, 2, 'A'], [8, 10, 'O']]
    for (const [row, col, letter] of crossings) {
      const cell = grid.get(cellKey(row, col))!
      expect(cell.letter).toBe(letter)
      expect(cell.refs).toHaveLength(2)
      expect(new Set(cell.refs.map(ref => ref.direction))).toEqual(new Set(['across', 'down']))
    }
    expect([...grid.values()].filter(cell => cell.refs.length > 1)).toHaveLength(crossings.length)
  })

  it('fails when two words disagree on a crossing', () => {
    const broken = words.map(w => (w.number === 2 ? { ...w, answer: 'XVIDENCIAS' } : w))
    expect(() => buildGrid(broken)).toThrow()
  })

  it('orders the words across first, then down', () => {
    expect(tabOrder(words)).toEqual([1, 3, 4, 6, 2, 5])
  })
})

describe('normalization', () => {
  it('ignores case, accents and spaces but keeps Ñ', () => {
    expect(normalizeLetters('diagnóstico')).toBe('DIAGNOSTICO')
    expect(normalizeLetters(' pa gos ')).toBe('PAGOS')
    expect(normalizeLetters('niño')).toBe('NIÑO')
    expect(toCellLetter('ñ')).toBe('Ñ')
    expect(toCellLetter('é')).toBe('E')
    expect(toCellLetter('3')).toBeNull()
  })
})

describe('checking', () => {
  it('counts empty or incomplete words as wrong', () => {
    const letters = withWrongWord(solved(), 5, 'PAGO')
    const results = evaluate(words, letters)
    expect(results[5]).toBe(false)
    expect(Object.values(results).filter(Boolean)).toHaveLength(5)
    expect(evaluate(words, {})[1]).toBe(false)
  })

  it('lists the modules to review without repeats', () => {
    const results = { 1: true, 3: true, 4: false, 6: false, 2: true, 5: false }
    expect(modulesToReview(words, results)).toEqual([2, 3])
    expect(modulesPhrase([3])).toBe('el módulo 3')
    expect(modulesPhrase([2, 3])).toBe('los módulos 2 y 3')
    expect(modulesPhrase([1, 2, 3])).toBe('los módulos 1, 2 y 3')
  })

  it('retry clears only wrong words and keeps cells shared with correct ones', () => {
    // Word 4 wrong: its first cell (4,2) is shared with the correct word 2.
    const letters = withWrongWord(solved(), 4, 'EXCEPTO')
    const results = evaluate(words, letters)
    const next = retryLetters(words, letters, results)
    expect(next[cellKey(4, 2)]).toBe('E')
    expect(next[cellKey(4, 3)]).toBeUndefined()
    expect(next[cellKey(4, 8)]).toBeUndefined()
    expect(next[cellKey(0, 1)]).toBe('R')
  })

  it('keeps passed once reached, even if the score drops', () => {
    let state = { ...initialCrossword, letters: withWrongWord(solved(), 4, 'EXCEPTO') }
    state = applyCheck(state, words)
    expect(state).toMatchObject({ score: 5, bestScore: 5, attempts: 1, passed: true })

    state = { ...state, letters: withWrongWord(withWrongWord(withWrongWord(state.letters, 1, ''), 4, ''), 6, 'F') }
    state = applyCheck(state, words)
    expect(state.score).toBeLessThan(5)
    expect(state).toMatchObject({ bestScore: 5, attempts: 2, passed: true })

    state = applyRetry(state, words)
    expect(state).toMatchObject({ checked: false, results: null, score: null, passed: true })
  })

  it('editing a word after checking removes its mark only', () => {
    const grid = buildGrid(words)
    const state = applyCheck({ ...initialCrossword, letters: solved() }, words)
    // (8,10) is shared by words 6 and 5.
    const next = applyLetters(state, grid, { [cellKey(8, 10)]: 'A' })
    expect(next.edited).toEqual([5, 6])
    expect(wordMark(next, 6)).toBeNull()
    expect(wordMark(next, 5)).toBeNull()
    expect(wordMark(next, 1)).toBe(true)
  })
})
