import { pointerIntersection } from '@dnd-kit/collision'
import { Accessibility, type DragEndEvent } from '@dnd-kit/dom'
import { DragDropProvider, useDraggable, useDroppable } from '@dnd-kit/react'
import { Check, GripVertical } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { Card } from '../components/ui/Card'
import { emitAvatarReaction } from '../components/avatar/avatarReaction'
import { Feedback, type FeedbackResult } from '../components/ui/Feedback'
import { frame } from '../content/frame'
import { useSlots } from '../state/navigation'
import { isDragFeedback, noDropAnimation, pointerSensor, type CustomizePlugins } from './dnd'

export type SequenceStep = {
  id: string
  text: string
  /** Feedback when the step lands in its right position. */
  feedback: string
}

export type SequenceActivityProps = {
  /** Key of the activity in the global state (e.g. "s09"). */
  id: string
  title: string
  instruction: string
  /** Steps in their correct order. */
  steps: SequenceStep[]
  /** Order of the step bank (step ids), fixed. */
  initialOrder: string[]
  /** Feedback when a step lands in a wrong position. */
  reviewFeedback: string
  className?: string
}

// Keyboard and screen readers use the bank buttons, not keyboard dragging:
// pointer only, and no dnd-kit roles or instructions on the buttons.
const sensors = [pointerSensor]
const plugins: CustomizePlugins = defaults => [
  ...defaults.filter(plugin => plugin !== Accessibility && !isDragFeedback(plugin)),
  noDropAnimation,
]

const slotId = (index: number) => `slot-${index}`

const BankStep = ({ step, label, onPlace }: { step: SequenceStep, label: string, onPlace: (button: HTMLButtonElement) => void }) => {
  const { ref } = useDraggable({ id: step.id })
  return (
    <li>
      <button
        ref={ref}
        type="button"
        aria-label={label}
        onClick={event => onPlace(event.currentTarget)}
        className="flex min-h-11 items-center gap-2 rounded-control border-[1.5px] border-line bg-surface py-2 pr-4 pl-3 text-left text-small"
      >
        <GripVertical aria-hidden="true" className="size-4 shrink-0 text-faint" />
        {step.text}
      </button>
    </li>
  )
}

const Slot = ({ index, step }: { index: number, step: SequenceStep | undefined }) => {
  // Slots are short and close together: the pointer decides the target, not the dragged chip's overlap.
  const { ref, isDropTarget } = useDroppable({ id: slotId(index), disabled: Boolean(step), collisionDetector: pointerIntersection })
  const box = step
    ? 'border-solid border-data bg-surface'
    : `border-dashed border-control ${isDropTarget ? 'bg-data-soft' : ''}`
  return (
    <li ref={ref} className={`flex min-h-11.5 items-center gap-4 rounded-control border-[1.5px] px-4 py-2 text-small transition-[background-color] ${box}`}>
      <span className={`w-3 shrink-0 font-medium ${step ? 'text-data' : 'text-muted'}`}>{index + 1}</span>
      {step
        ? (
            <>
              <span className="flex-1">{step.text}</span>
              <Check aria-hidden="true" className="size-4.5 shrink-0 text-data" />
            </>
          )
        : <span className="text-muted">{frame.dropStepHere}</span>}
    </li>
  )
}

/**
 * Put the steps in order by dragging them into numbered slots. A step only stays
 * in its right position; otherwise it goes back to the bank. Every bank step is
 * also a button that places it in the first empty slot (keyboard alternative).
 */
export const SequenceActivity = ({ id, title, instruction, steps, initialOrder, reviewFeedback, className = '' }: SequenceActivityProps) => {
  const titleId = useId()
  const [slots, fill] = useSlots(id, steps.length)
  const [message, setMessage] = useState<{ result: FeedbackResult, text: string } | null>(null)
  const bankRef = useRef<HTMLUListElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  // A drag that ends over the bank button would also fire its click: ignore that click.
  const dragging = useRef(false)

  const bank = initialOrder
    .filter(stepId => !slots.includes(stepId))
    .map(stepId => steps.find(step => step.id === stepId))
    .filter(step => step !== undefined)
  const firstEmpty = slots.indexOf(null)

  const tryPlace = (step: SequenceStep, index: number) => {
    if (steps[index]?.id === step.id) {
      fill(index, step.id)
      setMessage({ result: 'correct', text: step.feedback })
      emitAvatarReaction('cheer')
      return true
    }
    setMessage({ result: 'review', text: reviewFeedback })
    emitAvatarReaction('doubt')
    return false
  }

  // Button path: the placed step leaves the bank, so focus moves to a neighbouring step (or the title).
  const placeFromBank = (step: SequenceStep, button: HTMLButtonElement) => {
    if (dragging.current || firstEmpty === -1) return
    if (!tryPlace(step, firstEmpty)) return
    const buttons = [...(bankRef.current?.querySelectorAll('button') ?? [])]
    const position = buttons.indexOf(button)
    const neighbour = buttons[position + 1] ?? buttons[position - 1] ?? titleRef.current
    neighbour?.focus()
  }

  const handleDragEnd = ({ operation, canceled }: DragEndEvent) => {
    setTimeout(() => {
      dragging.current = false
    })
    const step = steps.find(candidate => candidate.id === operation.source?.id)
    if (canceled || !step || !operation.target) return
    const index = Number(String(operation.target.id).replace('slot-', ''))
    tryPlace(step, index)
  }

  return (
    <Card as="section" aria-labelledby={titleId} className={`flex flex-col gap-5 p-6 xl:p-7 ${className}`}>
      <div className="flex flex-col gap-1">
        <h2 id={titleId} ref={titleRef} tabIndex={-1} className="text-h2">{title}</h2>
        <p className="text-small text-ink-soft">{instruction}</p>
      </div>

      <DragDropProvider
        sensors={sensors}
        plugins={plugins}
        onDragStart={() => {
          dragging.current = true
        }}
        onDragEnd={handleDragEnd}
      >
        <ol className="flex flex-col gap-2">
          {slots.map((stepId, index) => (
            <Slot key={slotId(index)} index={index} step={steps.find(step => step.id === stepId)} />
          ))}
        </ol>

        {bank.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-small text-muted">{frame.stepsToPlace}</p>
            <ul ref={bankRef} className="flex flex-wrap gap-2">
              {bank.map(step => (
                <BankStep
                  key={step.id}
                  step={step}
                  label={frame.placeStep(step.text, firstEmpty + 1)}
                  onPlace={button => placeFromBank(step, button)}
                />
              ))}
            </ul>
          </div>
        )}
      </DragDropProvider>

      <Feedback result={message?.result ?? null}>{message?.text}</Feedback>
    </Card>
  )
}
