import type { CrosswordState } from '../state/navigation'

export type Direction = 'across' | 'down'

export type CrosswordWord = {
  number: number
  direction: Direction
  /** Answer in upper case, without accents. */
  answer: string
  /** Start cell, 0-based from the top-left corner. */
  row: number
  col: number
  module: number
  clue: string
  feedback: string
}

export type CellRef = { number: number, direction: Direction, index: number, length: number }

export type Cell = { key: string, row: number, col: number, letter: string, refs: CellRef[] }

/** Words needed to reach the learning outcome. */
export const PASS_SCORE = 5

export const cellKey = (row: number, col: number) => `${row},${col}`

export const wordCells = (word: CrosswordWord) =>
  Array.from({ length: word.answer.length }, (_, index) =>
    word.direction === 'across'
      ? cellKey(word.row, word.col + index)
      : cellKey(word.row + index, word.col))

const N_TILDE = /Ñ/g
const PLACEHOLDER = '\u0000'

/** Upper case, without accents (except Ñ) or spaces: "diagnóstico" -> "DIAGNOSTICO". */
export const normalizeLetters = (value: string) =>
  value
    .toUpperCase()
    .normalize('NFC')
    .replace(N_TILDE, PLACEHOLDER)
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replaceAll(PLACEHOLDER, 'Ñ')
    .replace(/\s/g, '')

/** One typed character as a cell letter, or null if it is not A–Z or Ñ. */
export const toCellLetter = (char: string) => {
  const letter = normalizeLetters(char)
  return /^[A-ZÑ]$/.test(letter) ? letter : null
}

/** Cells of the crossword by key. Throws if two words disagree on a shared cell. */
export const buildGrid = (words: CrosswordWord[]) => {
  const grid = new Map<string, Cell>()
  for (const word of words) {
    wordCells(word).forEach((key, index) => {
      const letter = word.answer[index]
      const [row, col] = key.split(',').map(Number)
      const ref: CellRef = { number: word.number, direction: word.direction, index, length: word.answer.length }
      const cell = grid.get(key)
      if (!cell) {
        grid.set(key, { key, row, col, letter, refs: [ref] })
        return
      }
      if (cell.letter !== letter) {
        throw new Error(`Crossing at (${key}): ${cell.letter} vs ${letter} (word ${word.number})`)
      }
      cell.refs.push(ref)
    })
  }
  return grid
}

/** Grid as text, "." for black cells: used to compare with the storyboard layout. */
export const gridToText = (grid: Map<string, Cell>, rows: number, cols: number) =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => grid.get(cellKey(row, col))?.letter ?? '.').join(''))

/** Clue order: across words first, then down words, each by number. */
export const tabOrder = (words: CrosswordWord[]) =>
  [...words]
    .sort((a, b) => (a.direction === b.direction ? a.number - b.number : a.direction === 'across' ? -1 : 1))
    .map(word => word.number)

export const isWordCorrect = (word: CrosswordWord, letters: Record<string, string>) =>
  wordCells(word).every((key, index) => (letters[key] ?? '') === word.answer[index])

export const evaluate = (words: CrosswordWord[], letters: Record<string, string>) =>
  Object.fromEntries(words.map(word => [word.number, isWordCorrect(word, letters)])) as Record<number, boolean>

/** Modules of the wrong words, without repeats and in order. */
export const modulesToReview = (words: CrosswordWord[], results: Record<number, boolean>) =>
  [...new Set(words.filter(word => results[word.number] === false).map(word => word.module))].sort((a, b) => a - b)

/** Clears the wrong words, except the cells shared with a correct word. */
export const retryLetters = (words: CrosswordWord[], letters: Record<string, string>, results: Record<number, boolean>) => {
  const keep = new Set(words.filter(word => results[word.number] === true).flatMap(wordCells))
  const next = { ...letters }
  for (const word of words) {
    if (results[word.number] === true) continue
    for (const key of wordCells(word)) if (!keep.has(key)) delete next[key]
  }
  return next
}

export const initialCrossword: CrosswordState = {
  letters: {},
  checked: false,
  results: null,
  score: null,
  edited: [],
  bestScore: 0,
  attempts: 0,
  passed: false,
}

/** State after "Comprobar": bestScore only grows and passed never goes back to false. */
export const applyCheck = (state: CrosswordState, words: CrosswordWord[]): CrosswordState => {
  const results = evaluate(words, state.letters)
  const score = Object.values(results).filter(Boolean).length
  const bestScore = Math.max(state.bestScore, score)
  return {
    ...state,
    checked: true,
    results,
    score,
    edited: [],
    bestScore,
    attempts: state.attempts + 1,
    passed: state.passed || bestScore >= PASS_SCORE,
  }
}

/**
 * State after "Intentar de nuevo": clears marks and result, and the letters of the wrong words
 * (judged on the current letters, so a word fixed after checking is never erased).
 */
export const applyRetry = (state: CrosswordState, words: CrosswordWord[]): CrosswordState => ({
  ...state,
  letters: retryLetters(words, state.letters, evaluate(words, state.letters)),
  checked: false,
  results: null,
  score: null,
  edited: [],
})

/** Mark of a word: true/false after a check, null before it or if edited since. */
export const wordMark = (state: CrosswordState, number: number) =>
  state.checked && state.results && !state.edited.includes(number) ? state.results[number] ?? null : null

/**
 * New letters for some cells. After a check, the words that cross a changed cell
 * lose their mark until the next check.
 */
export const applyLetters = (
  state: CrosswordState,
  grid: Map<string, Cell>,
  changes: Record<string, string>,
): CrosswordState => {
  const letters = { ...state.letters }
  const touched = new Set<number>()
  for (const [key, letter] of Object.entries(changes)) {
    if ((letters[key] ?? '') === letter) continue
    if (letter) letters[key] = letter
    else delete letters[key]
    grid.get(key)?.refs.forEach(ref => touched.add(ref.number))
  }
  if (touched.size === 0) return state
  const edited = state.checked ? [...new Set([...state.edited, ...touched])].sort((a, b) => a - b) : state.edited
  return { ...state, letters, edited }
}
