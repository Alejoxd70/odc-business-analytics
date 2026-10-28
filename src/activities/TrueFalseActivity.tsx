import { useId } from 'react'
import { Card } from '../components/ui/Card'
import { Feedback } from '../components/ui/Feedback'
import { frame } from '../content/frame'
import { useActivity } from '../state/navigation'

export type TrueFalseAnswer = 'true' | 'false'

export type TrueFalseItem = {
  statement: string
  answer: TrueFalseAnswer
  feedback: string
}

export type TrueFalseActivityProps = {
  /** Key of the activity in the global state (e.g. "s05"). */
  id: string
  title: string
  items: TrueFalseItem[]
  className?: string
}

const options: { value: TrueFalseAnswer, label: string }[] = [
  { value: 'true', label: frame.trueLabel },
  { value: 'false', label: frame.falseLabel },
]

const pillState = (chosen: boolean, correct: boolean) => {
  if (!chosen) return 'border-control bg-surface text-muted'
  return correct ? 'border-data bg-data text-white' : 'border-alert bg-alert text-white'
}

/** True/false statements built on native radios, with immediate feedback. */
export const TrueFalseActivity = ({ id, title, items, className = '' }: TrueFalseActivityProps) => {
  const titleId = useId()
  const [answers, setAnswer] = useActivity(id, items.length)
  const answeredCount = answers.filter(answer => answer !== null).length

  return (
    <Card as="section" aria-labelledby={titleId} className={`flex flex-col p-6 xl:p-8 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pb-2">
        <h2 id={titleId} className="text-h2">{title}</h2>
        <p className="text-caption text-muted">{frame.answered(answeredCount, items.length)}</p>
      </div>

      {items.map((item, index) => {
        const chosen = answers[index]
        const result = chosen === null ? null : chosen === item.answer ? 'correct' : 'review'
        return (
          <fieldset key={item.statement} className="flex flex-col gap-3 border-t-[1.5px] border-line py-5 first-of-type:border-t-0 last:pb-0">
            <legend className="float-left w-full text-body">
              <span className="font-medium text-data">{`${index + 1}.`}</span>
              {' '}
              {item.statement}
            </legend>
            <div className="flex flex-wrap gap-3">
              {options.map(option => (
                <label key={option.value} className="group py-0.75">
                  <input
                    type="radio"
                    name={`${id}-${index}`}
                    value={option.value}
                    checked={chosen === option.value}
                    onChange={() => setAnswer(index, option.value)}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex h-9.5 min-w-26 items-center justify-center rounded-full border-[1.5px] px-4 text-small font-medium transition-[color,background-color,border-color] peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ink ${
                      pillState(chosen === option.value, option.value === item.answer)
                    }`}
                  >
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            <Feedback result={result}>{item.feedback}</Feedback>
          </fieldset>
        )
      })}
    </Card>
  )
}
