import {
  Accessibility,
  Feedback as DragFeedback,
  KeyboardSensor,
  PointerActivationConstraints,
  PointerSensor,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/dom'
import { DragDropProvider, useDraggable, useDroppable } from '@dnd-kit/react'
import { GripVertical, X } from 'lucide-react'
import { useEffect, useId, useState, type ComponentProps, type ReactNode } from 'react'
import { Feedback } from '../components/ui/Feedback'
import { frame } from '../content/frame'
import { dataStates, type DataStateId } from '../content/states'
import { usePlacements } from '../state/navigation'

export type ClassifyCase = {
  id: string
  name: string
  description: string
  correctState: DataStateId
  correctFeedback: string
  reviewFeedback: string
}

export type ClassifyActivityProps = {
  /** Key of the activity in the global state (e.g. "s07"). */
  id: string
  cases: ClassifyCase[]
  className?: string
}

type DataState = (typeof dataStates)[number]
type ZoneStatus = 'empty' | 'correct' | 'review'
/** Extra data on draggables and droppables, used by the screen reader announcements. */
type DragData = { name: string }

/** Droppable id of the case list: dropping there takes the case out of its zone. */
const CASE_LIST = 'cases'

// Full class names so Tailwind can detect them.
const zoneBorder: Record<ZoneStatus, string> = {
  empty: 'border-[1.5px] border-dashed border-control',
  correct: 'border-2 border-data',
  review: 'border-2 border-alert',
}

const nameOf = (entity: { data?: unknown } | null | undefined) => (entity?.data as DragData | undefined)?.name ?? ''

const sensors = [
  PointerSensor.configure({
    // Touch: long press, so swiping still scrolls the page. Mouse and pen: a few pixels of movement.
    activationConstraints: event => event.pointerType === 'touch'
      ? [new PointerActivationConstraints.Delay({ value: 250, tolerance: 5 })]
      : [new PointerActivationConstraints.Distance({ value: 6 })],
  }),
  KeyboardSensor.configure({ offset: 24 }),
]

// Instructions and announcements in Spanish. The result of a drop is announced by the activity itself.
type PluginsOption = NonNullable<ComponentProps<typeof DragDropProvider>['plugins']>
type CustomizePlugins = Extract<PluginsOption, (...args: never[]) => unknown>

const plugins: CustomizePlugins = defaults => [
  ...defaults.filter(plugin => plugin !== Accessibility && plugin !== DragFeedback),
  Accessibility.configure({
    screenReaderInstructions: { draggable: frame.dragInstructions },
    announcements: {
      dragstart: ({ operation }: DragStartEvent) => frame.dragStart(nameOf(operation.source)),
      dragover: ({ operation }: DragOverEvent) => operation.target
        ? frame.dragOver(nameOf(operation.source), nameOf(operation.target))
        : frame.dragOutside(nameOf(operation.source)),
      dragend: ({ operation, canceled }: DragEndEvent) => canceled ? frame.dragCancel(nameOf(operation.source)) : undefined,
    },
  }),
  DragFeedback.configure({ dropAnimation: null }),
]

/** Focuses the element with this id once it is mounted, if requested (the case just moved there). */
const useFocusOnMount = (elementId: string, requested: boolean, onDone: () => void) => {
  useEffect(() => {
    if (!requested) return
    document.getElementById(elementId)?.focus()
    onDone()
  }, [elementId, requested, onDone])
}

type FocusProps = { focusRequested: boolean, onFocused: () => void }

const caseCard = 'flex gap-3 rounded-card border-[1.5px] border-line bg-surface p-4'

const UnplacedCase = ({ item, cardId, focusRequested, onFocused }: FocusProps & { item: ClassifyCase, cardId: string }) => {
  const { ref } = useDraggable<DragData>({ id: item.id, data: { name: item.name } })
  useFocusOnMount(cardId, focusRequested, onFocused)
  return (
    <li>
      <div ref={ref} id={cardId} role="button" tabIndex={0} aria-roledescription={frame.draggable} className={`${caseCard} cursor-grab`}>
        <GripVertical aria-hidden="true" className="mt-1 size-4.5 shrink-0 text-faint" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-body font-medium">{item.name}</p>
          <p className="text-small text-ink-soft">{item.description}</p>
        </div>
      </div>
    </li>
  )
}

const PlacedCase = ({ item, correct, handleId, onRemove, focusRequested, onFocused }: FocusProps & {
  item: ClassifyCase
  correct: boolean
  handleId: string
  onRemove: () => void
}) => {
  const { ref, handleRef } = useDraggable<DragData>({ id: item.id, data: { name: item.name } })
  useFocusOnMount(handleId, focusRequested, onFocused)
  return (
    <li className="flex flex-col items-start gap-2">
      {/* The name is the drag handle, so the remove button is not nested inside it */}
      <div ref={ref} className="on-dark inline-flex items-center gap-1 rounded-full bg-ink py-1 pr-1 pl-1 text-small text-white">
        <span ref={handleRef} id={handleId} role="button" tabIndex={0} aria-roledescription={frame.draggable} className="cursor-grab rounded-full py-0.5 pl-2.5 pr-1">
          {item.name}
        </span>
        <button
          type="button"
          aria-label={frame.removeCase(item.name)}
          onClick={onRemove}
          className="relative grid size-7 place-items-center rounded-full transition-[background-color] before:absolute before:-inset-2 before:content-[''] hover:bg-white/15"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
      <Feedback live={false} result={correct ? 'correct' : 'review'}>
        {correct ? item.correctFeedback : item.reviewFeedback}
      </Feedback>
    </li>
  )
}

const Zone = ({ state, status, children }: { state: DataState, status: ZoneStatus, children: ReactNode }) => {
  const { ref, isDropTarget } = useDroppable<DragData>({ id: state.id, data: { name: state.name } })
  const background = isDropTarget ? 'bg-data-soft' : status === 'empty' ? 'bg-surface/55' : 'bg-surface'
  return (
    <li ref={ref} className={`flex min-h-20 flex-col justify-center gap-3 rounded-card px-5 py-4 transition-[background-color] ${zoneBorder[status]} ${background}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-h3">{state.name}</h2>
        <span className="shrink-0 text-caption text-muted">{state.label}</span>
      </div>
      {children}
    </li>
  )
}

/**
 * Drag each case to a category (data state). Works with mouse, touch (long press)
 * and keyboard (Space or Enter to pick up, arrows to move, Space or Enter to drop).
 */
export const ClassifyActivity = ({ id, cases, className = '' }: ClassifyActivityProps) => {
  const baseId = useId()
  const cardId = (caseId: string) => `${baseId}-card-${caseId}`
  const handleId = (caseId: string) => `${baseId}-handle-${caseId}`

  const [placements, place] = usePlacements(id, cases.map(item => item.id))
  const [message, setMessage] = useState('')
  /** Case that just moved: it takes the focus once it is rendered in its new place. */
  const [focusCase, setFocusCase] = useState<string | null>(null)
  const clearFocusCase = () => setFocusCase(null)
  const { ref: listRef } = useDroppable<DragData>({ id: CASE_LIST, data: { name: frame.caseList } })

  // The case moves to another place in the DOM; focus follows it so the keyboard does not lose it.
  const placeCase = (item: ClassifyCase, state: DataStateId | null) => {
    place(item.id, state)
    setFocusCase(item.id)
    if (state === null) {
      setMessage(frame.returnedCase(item.name))
      return
    }
    const correct = state === item.correctState
    const stateName = dataStates[state - 1].name
    setMessage(`${frame.placedIn(item.name, stateName)} ${correct ? frame.correctPrefix : frame.reviewPrefix} ${correct ? item.correctFeedback : item.reviewFeedback}`)
  }

  const handleDragEnd = ({ operation, canceled }: DragEndEvent) => {
    const item = cases.find(candidate => candidate.id === operation.source?.id)
    if (canceled || !item || !operation.target) return
    const target = operation.target.id === CASE_LIST ? null : (operation.target.id as DataStateId)
    if ((placements[item.id] ?? null) !== target) placeCase(item, target)
  }

  return (
    <DragDropProvider sensors={sensors} plugins={plugins} onDragEnd={handleDragEnd}>
      <div className={`grid gap-10 lg:grid-cols-2 lg:gap-x-12 ${className}`}>
        <ul ref={listRef} className="flex flex-col gap-3">
          {cases.map(item => (placements[item.id] == null
            ? <UnplacedCase key={item.id} item={item} cardId={cardId(item.id)} focusRequested={focusCase === item.id} onFocused={clearFocusCase} />
            : (
                <li key={item.id} className="flex min-h-24 items-center justify-center rounded-card border-[1.5px] border-dashed border-control text-small text-muted">
                  {frame.casePlaced}
                </li>
              )))}
        </ul>

        <ul className="flex flex-col gap-3">
          {dataStates.map((state) => {
            const placed = cases.filter(item => placements[item.id] === state.id)
            const status: ZoneStatus = placed.length === 0
              ? 'empty'
              : placed.some(item => item.correctState === state.id) ? 'correct' : 'review'
            return (
              <Zone key={state.id} state={state} status={status}>
                {placed.length > 0 && (
                  <ul className="flex flex-col gap-3">
                    {placed.map(item => (
                      <PlacedCase
                        key={item.id}
                        item={item}
                        correct={item.correctState === state.id}
                        handleId={handleId(item.id)}
                        onRemove={() => placeCase(item, null)}
                        focusRequested={focusCase === item.id}
                        onFocused={clearFocusCase}
                      />
                    ))}
                  </ul>
                )}
              </Zone>
            )
          })}
        </ul>
      </div>

      <p aria-live="polite" aria-atomic="true" className="sr-only">{message}</p>
    </DragDropProvider>
  )
}
