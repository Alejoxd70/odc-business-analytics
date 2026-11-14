import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { Check } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { emitAvatarReaction } from '../components/avatar/avatarReaction'
import { Feedback } from '../components/ui/Feedback'
import { modules } from '../content/modules'
import type { screen13 } from '../content/screen13'
import { useCrossword, useNavigation } from '../state/navigation'
import {
  PASS_SCORE,
  applyCheck,
  applyLetters,
  applyRetry,
  buildGrid,
  cellKey,
  modulesToReview,
  tabOrder,
  toCellLetter,
  wordCells,
  wordMark,
  type Cell,
  type CrosswordWord,
  type Direction,
} from './crosswordLogic'

export type CrosswordText = typeof screen13.crossword

export type CrosswordProps = {
  /** Key of the activity in the global state (e.g. "s13"). */
  id: string
  text: CrosswordText
  /** Grid classes of each block, set by the screen. */
  placement: { grid: string, controls: string, panel: string }
}

type Active = { number: number, key: string }
type Mark = boolean | null

const arrows: Record<string, { dRow: number, dCol: number, axis: Direction }> = {
  ArrowLeft: { dRow: 0, dCol: -1, axis: 'across' },
  ArrowRight: { dRow: 0, dCol: 1, axis: 'across' },
  ArrowUp: { dRow: -1, dCol: 0, axis: 'down' },
  ArrowDown: { dRow: 1, dCol: 0, axis: 'down' },
}

const markStyle = (mark: Mark) => {
  if (mark === true) return 'border-data bg-data-soft text-data-deep'
  if (mark === false) return 'border-alert bg-alert-soft text-alert-deep'
  return null
}

/** Crossword grid with its clue panel; letters and results live in the store. */
export const Crossword = ({ id, text, placement }: CrosswordProps) => {
  const { goTo } = useNavigation()
  const [state, setState] = useCrossword(id)
  const words: CrosswordWord[] = text.words
  const grid = buildGrid(words)
  const cells = [...grid.values()]
  const rows = Math.max(...cells.map(cell => cell.row)) + 1
  const cols = Math.max(...cells.map(cell => cell.col)) + 1
  const order = tabOrder(words)
  const byNumber = new Map(words.map(word => [word.number, word]))
  const getWord = (number: number) => byNumber.get(number)!

  const [active, setActive] = useState<Active | null>(null)

  const cellRefs = useRef(new Map<string, HTMLInputElement>())
  /** Word chosen by the code that moves the focus; read by the cell's focus handler. */
  const intended = useRef<number | null>(null)

  const marks = new Map(words.map(word => [word.number, wordMark(state, word.number)]))
  const cellMark = (cell: Cell): Mark => {
    const cellMarks = cell.refs.map(ref => marks.get(ref.number))
    if (cellMarks.includes(true)) return true
    if (cellMarks.includes(false)) return false
    return null
  }

  const write = (changes: Record<string, string>) => setState(applyLetters(state, grid, changes))

  const focusCell = (key: string, number: number) => {
    intended.current = number
    setActive({ number, key })
    cellRefs.current.get(key)?.focus()
  }

  /** First empty cell of a word, or its first cell. */
  const entryCell = (word: CrosswordWord, letters = state.letters) => {
    const keys = wordCells(word)
    return keys.find(key => !letters[key]) ?? keys[0]
  }

  const focusWord = (number: number, letters = state.letters) =>
    focusCell(entryCell(getWord(number), letters), number)

  // Grid ----------------------------------------------------------------------

  const onCellFocus = (cell: Cell) => {
    const wanted = intended.current
    intended.current = null
    const belongs = (number: number) => cell.refs.some(ref => ref.number === number)
    let number = cell.refs.find(ref => ref.direction === 'across')?.number ?? cell.refs[0].number
    if (wanted !== null && belongs(wanted)) number = wanted
    else if (active && belongs(active.number)) number = active.number
    setActive({ number, key: cell.key })
  }

  /** Second click on a focused crossing switches between across and down. */
  const onCellPointerDown = (cell: Cell, input: HTMLInputElement) => {
    if (document.activeElement !== input || cell.refs.length < 2 || !active) return
    const other = cell.refs.find(ref => ref.number !== active.number)
    if (other) setActive({ number: other.number, key: cell.key })
  }

  const step = (key: string, delta: 1 | -1) => {
    if (!active) return null
    const keys = wordCells(getWord(active.number))
    return keys[keys.indexOf(key) + delta] ?? null
  }

  const onCellChange = (cell: Cell, event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    if (raw === '') {
      write({ [cell.key]: '' })
      return
    }
    // With a letter already in the cell, the new one is the character that differs from it.
    const old = state.letters[cell.key] ?? ''
    const typed = raw.length > 1 && raw[0].toUpperCase() === old ? raw.slice(1) : raw.slice(0, 1)
    const letter = toCellLetter(typed)
    if (!letter) return
    write({ [cell.key]: letter })
    const next = step(cell.key, 1)
    if (next && active) focusCell(next, active.number)
  }

  const onCellKeyDown = (cell: Cell, event: KeyboardEvent<HTMLInputElement>) => {
    const number = active?.number ?? cell.refs[0].number
    if (event.key === 'Backspace') {
      event.preventDefault()
      const prev = step(cell.key, -1)
      if (state.letters[cell.key]) {
        write({ [cell.key]: '' })
        if (prev) focusCell(prev, number)
      }
      else if (prev) {
        write({ [prev]: '' })
        focusCell(prev, number)
      }
      return
    }
    if (event.key === 'Delete') {
      event.preventDefault()
      write({ [cell.key]: '' })
      return
    }
    const arrow = arrows[event.key]
    if (arrow) {
      event.preventDefault()
      let row = cell.row + arrow.dRow
      let col = cell.col + arrow.dCol
      while (row >= 0 && row < rows && col >= 0 && col < cols) {
        const target = grid.get(cellKey(row, col))
        if (target) {
          const ref = target.refs.find(r => r.direction === arrow.axis) ?? target.refs[0]
          focusCell(target.key, ref.number)
          return
        }
        row += arrow.dRow
        col += arrow.dCol
      }
      return
    }
    if (event.key === 'Tab') {
      const target = order[order.indexOf(number) + (event.shiftKey ? -1 : 1)]
      if (target === undefined) return // leave the grid
      event.preventDefault()
      focusCell(wordCells(getWord(target))[0], target)
    }
  }

  // The only tabbable cell: the active one, or the first cell of the first word.
  const tabbable = active?.key ?? wordCells(getWord(order[0]))[0]
  const activeKeys = new Set(active ? wordCells(getWord(active.number)) : [])

  const gridBlock = (
    <div className={`max-w-full overflow-x-auto [--cell:34px] xl:[--cell:42px] ${placement.grid}`}>
      <div
        role="group"
        aria-label={text.gridLabel}
        className="grid w-max pr-[1.5px] pb-[1.5px]"
        style={{
          gridTemplateColumns: `repeat(${cols}, calc(var(--cell) - 1.5px))`,
          gridTemplateRows: `repeat(${rows}, calc(var(--cell) - 1.5px))`,
        }}
      >
        {cells.map((cell) => {
          const mark = cellMark(cell)
          const start = cell.refs.find(ref => ref.index === 0)
          const label = cell.refs.map(ref => text.cellPart(ref.number, ref.direction, ref.index + 1, ref.length)).join('; ')
          const tone = markStyle(mark) ?? `border-control text-ink ${activeKeys.has(cell.key) ? 'bg-state-1' : 'bg-surface'}`
          return (
            <div
              key={cell.key}
              className={`relative size-(--cell) focus-within:z-20 ${mark === null ? '' : 'z-10'}`}
              style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }}
            >
              <input
                ref={(el) => {
                  if (!el) return
                  cellRefs.current.set(cell.key, el)
                  return () => {
                    cellRefs.current.delete(cell.key)
                  }
                }}
                type="text"
                value={state.letters[cell.key] ?? ''}
                aria-label={label}
                tabIndex={cell.key === tabbable ? 0 : -1}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                onFocus={(event) => {
                  onCellFocus(cell)
                  event.target.select()
                }}
                onPointerDown={event => onCellPointerDown(cell, event.currentTarget)}
                onChange={event => onCellChange(cell, event)}
                onKeyDown={event => onCellKeyDown(cell, event)}
                className={`size-full rounded-none border-[1.5px] pt-1 text-center text-[19px] font-medium uppercase caret-transparent transition-[background-color] focus:outline-[2.5px] focus:outline-offset-[2.5px] focus:outline-ink ${tone}`}
              />
              {start && (
                <span aria-hidden="true" className="pointer-events-none absolute top-0.5 left-1 text-caption leading-none text-ink-soft">
                  {start.number}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  // Controls ------------------------------------------------------------------

  const check = () => {
    const checked = applyCheck(state, words)
    setState(checked)
    emitAvatarReaction(checked.score !== null && checked.score >= PASS_SCORE ? 'cheer' : 'doubt')
  }

  const retry = () => {
    const next = applyRetry(state, words)
    setState(next)
    const firstWrong = order.find(number => state.results?.[number] === false)
    if (firstWrong !== undefined) focusWord(firstWrong, next.letters)
  }

  const passedNow = state.score !== null && state.score >= PASS_SCORE
  const review = state.results ? modulesToReview(words, state.results) : []

  const controls = (
    <div className={`flex flex-col gap-4 ${placement.controls}`}>
      <Button size="sm" className="self-start" onClick={check}>{text.check}</Button>
      <div aria-live="polite" aria-atomic="true" className="flex flex-col gap-3">
        {state.checked && state.score !== null && (
          <>
            <p className="text-small text-ink-soft">
              <span className="font-medium text-ink">{text.statusCount(state.score, words.length)}</span>
              {' '}
              {text.statusRest}
            </p>
            <Feedback live={false} result={passedNow ? 'correct' : 'review'}>
              {passedNow ? text.passed : text.failed(review)}
            </Feedback>
          </>
        )}
      </div>
      {state.checked && !passedNow && (
        <div className="flex flex-wrap gap-3">
          {review.map(module => (
            <Button key={module} size="sm" variant="secondary" onClick={() => goTo(modules[module - 1].start)}>
              {text.moduleButton(module)}
            </Button>
          ))}
          <Button size="sm" onClick={retry}>{text.retry}</Button>
        </div>
      )}
    </div>
  )

  // Clues ---------------------------------------------------------------------

  const clueContent = (word: CrosswordWord, mark: Mark) => (
    <>
      <span className="text-small font-semibold">{word.number}</span>
      {' '}
      <span className="flex flex-col gap-0.5">
        <span className="text-caption font-medium text-data">{text.caseLabel(order.indexOf(word.number) + 1)}</span>
        {' '}
        <span className="text-small">
          {word.clue}
          {' '}
          <span className="text-muted">{text.length(word.answer.length)}</span>
        </span>
      </span>
      {mark === true && (
        <>
          {' '}
          <Check aria-hidden="true" className="size-4.5 text-data" strokeWidth={2.5} />
          <span className="sr-only">{text.correctSr}</span>
        </>
      )}
    </>
  )

  const clueRow = 'relative grid w-full grid-cols-[1.25rem_minmax(0,1fr)_1.25rem] items-start gap-x-3 rounded-control px-3 py-2.5 text-left'

  const panel = (
    <Card
      as="section"
      aria-label={text.cluesLabel}
      className={`flex flex-col gap-5 p-4 sm:p-6 lg:max-h-[calc(100dvh-var(--spacing-topbar)-var(--spacing-bottombar)-4rem)] lg:overflow-y-auto ${placement.panel}`}
    >
      {(['across', 'down'] as const).map(direction => (
        <div key={direction} className="flex flex-col gap-2">
          <h2 className="px-3 font-sans text-small font-semibold">{text.groups[direction]}</h2>
          <ol className="flex flex-col gap-1">
            {order.map(getWord).filter(word => word.direction === direction).map((word) => {
              const mark = marks.get(word.number) ?? null
              const isActive = active?.number === word.number
              return (
                <li key={word.number} className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => focusWord(word.number)}
                    className={`${clueRow} transition-[background-color] ${isActive ? 'bg-state-1' : 'hover:bg-paper'}`}
                  >
                    {clueContent(word, mark)}
                  </button>
                  {mark !== null && (
                    <div className="pr-3 pl-11">
                      <Feedback live={false} result={mark ? 'correct' : 'review'}>
                        {word.feedback}
                        {!mark && ` ${text.reviewModule(word.module)}`}
                      </Feedback>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </Card>
  )

  return (
    <>
      {gridBlock}
      {controls}
      {panel}
    </>
  )
}
