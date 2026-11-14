import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { Sparkles } from 'lucide-react'
import { Avatar } from './Avatar'
import { AVATAR_SCALE } from './avatarCanvas'
import { onAvatarReaction, type AvatarReaction } from './avatarReaction'
import { usePetDrag } from './usePetDrag'
import { RESTING_ARM, RESTING_MOUTH, useLipSync } from './useLipSync'
import { frame } from '../../content/frame'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useAudioState } from '../../state/audio'
import { useNavigation } from '../../state/navigation'

export type DataMindSize = 'sm' | 'md' | 'lg'

/** Size of the head's own 180 × 180 drawing; the canvas adds the body, arms and cloud. */
const robotSizes: Record<DataMindSize, number> = { sm: 72, md: 100, lg: 124 }

export type DataMindProps = {
  size?: DataMindSize
  /** Forces the speaking state. By default, DataMind speaks while its audio plays. */
  speaking?: boolean
  className?: string
  /** Key terms of the current screen, shown one at a time in the bubble (content/keywords.ts). */
  keywords?: readonly string[]
}

const noKeywords: readonly string[] = []

const restingPose = {
  '--avatar-mouth': RESTING_MOUTH,
  '--avatar-arm-l': RESTING_ARM,
  '--avatar-arm-r': RESTING_ARM,
  '--avatar-held': 0,
  '--pet-tilt': '0deg',
} as CSSProperties

/** How long a reaction to an answer lasts. */
const REACTION_TIME = 1200
/** The bubble appears once DataMind's entrance is over, and each text stays this long. */
const BUBBLE_DELAY = 1800
const BUBBLE_TIME = 3000
/** Free height (px) the bubble needs above DataMind; otherwise it goes below. */
const HINT_ROOM = 48
/** Closer than this (px) to a side edge, the hint lines up with that side instead of centring. */
const HINT_EDGE = 48
const hintAlign = { start: 'left-0', center: 'left-1/2 -translate-x-1/2', end: 'right-0' }

const hop: Keyframe[] = [
  { translate: '0 0' },
  { translate: '0 -14px', offset: 0.25 },
  { translate: '0 0', offset: 0.5 },
  { translate: '0 -6px', offset: 0.7 },
  { translate: '0 0' },
]
const doubt: Keyframe[] = [
  { rotate: '0deg' },
  { rotate: '-9deg', offset: 0.3 },
  { rotate: '-9deg', offset: 0.7 },
  { rotate: '0deg' },
]

/**
 * The text of the bubble. When it changes, the new one slides in from below while the
 * one before slides out upwards (bubble-word-in / bubble-word-out, index.css).
 */
const BubbleWord = ({ text }: { text: string }) => {
  const [current, setCurrent] = useState(text)
  const [previous, setPrevious] = useState<string | null>(null)
  if (text !== current) {
    setPrevious(current)
    setCurrent(text)
  }
  return (
    <span className="relative">
      {previous !== null && (
        <span key={`out-${previous}`} className="bubble-word-out absolute top-0 left-0">{previous}</span>
      )}
      <span key={current} data-avatar-word className="bubble-word-in inline-block">{current}</span>
    </span>
  )
}

/**
 * The guide avatar. It talks with its audio, reacts to the answers given in the
 * activities, and the user can pick it up and leave it anywhere on the screen (one
 * position remembered per screen, in the global state).
 */
export const DataMind = ({ size = 'md', speaking, className = '', keywords = noKeywords }: DataMindProps) => {
  const robot = robotSizes[size]
  const hintId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { isPlaying, analyser } = useAudioState()
  const { state, setAvatarOffset, markAvatarHintSeen } = useNavigation()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const talking = speaking ?? isPlaying

  useLipSync(svgRef, { active: talking, analyser })
  const dragHandlers = usePetDrag({
    wrapperRef,
    svgRef,
    saved: state.avatarOffsets?.[state.current] ?? null,
    onChange: offset => setAvatarOffset(state.current, offset),
  })

  // Reactions to the answers (avatarReaction.ts). Written straight to the DOM, like the
  // drag pose: cheering reuses the "held" pose (arms up, bulb lit) plus a small hop.
  useEffect(() => {
    let timer: number | undefined
    const settle = () => {
      const wrapper = wrapperRef.current
      const svg = svgRef.current
      if (!wrapper || !svg) return
      wrapper.removeAttribute('data-reaction')
      // A drag that started meanwhile owns the held pose.
      if (wrapper.hasAttribute('data-dragging')) return
      svg.removeAttribute('data-held')
      svg.style.setProperty('--avatar-held', '0')
    }
    const react = (reaction: AvatarReaction) => {
      const wrapper = wrapperRef.current
      const svg = svgRef.current
      if (!wrapper || !svg || wrapper.hasAttribute('data-dragging')) return
      window.clearTimeout(timer)
      settle()
      wrapper.setAttribute('data-reaction', reaction)
      if (reaction === 'cheer') {
        svg.setAttribute('data-held', '')
        // With reduced motion only the bulb lights up: nothing moves.
        if (!reducedMotion) {
          svg.style.setProperty('--avatar-held', '1')
          svg.animate(hop, { duration: 700, easing: 'ease-out' })
        }
      }
      else if (!reducedMotion) {
        svg.animate(doubt, { duration: 900, easing: 'ease-in-out' })
      }
      timer = window.setTimeout(settle, REACTION_TIME)
    }
    const unsubscribe = onAvatarReaction(react)
    return () => {
      unsubscribe()
      window.clearTimeout(timer)
    }
  }, [reducedMotion])

  // The bubble next to DataMind. The very first time it opens with the "you can drag me"
  // hint; then it goes through the screen's key terms, one at a time, over and over.
  // The hint is dropped for good once it has had its turn or DataMind is picked up.
  const [withDragHint, setWithDragHint] = useState(() => !(state.avatarHintSeen ?? false))
  const texts = withDragHint ? [frame.avatarDragHint, ...keywords] : keywords
  const [bubble, setBubble] = useState<{ index: number, side: 'above' | 'below', align: 'start' | 'center' | 'end' } | null>(null)
  // The cycle waits while the pointer is over DataMind or it has the keyboard focus, so
  // there is always a way to stop the changing text (WCAG 2.2.2).
  const [paused, setPaused] = useState(false)

  const dropDragHint = () => {
    if (!withDragHint) return
    setWithDragHint(false)
    markAvatarHintSeen()
  }

  const shown = bubble !== null
  const index = bubble?.index ?? 0
  const count = texts.length
  // With reduced motion nothing cycles: the first key term stays.
  const still = paused || (reducedMotion && !withDragHint) || count < 2
  useEffect(() => {
    if (count === 0 || (shown && still)) return
    const timer = window.setTimeout(() => {
      const wrapper = wrapperRef.current
      const layer = wrapper?.closest('[data-pet-bounds]')
      if (!wrapper || !layer) return
      // Measured on every change, since DataMind may have been moved: above when there is
      // room, and hugging the near edge so the layer does not clip the bubble.
      const box = wrapper.getBoundingClientRect()
      const bounds = layer.getBoundingClientRect()
      const place = {
        side: box.top - bounds.top >= HINT_ROOM ? 'above' as const : 'below' as const,
        align: bounds.right - box.right < HINT_EDGE ? 'end' as const : box.left - bounds.left < HINT_EDGE ? 'start' as const : 'center' as const,
      }
      if (!shown) {
        setBubble({ index: 0, ...place })
        return
      }
      // The drag hint leaves the list after its turn, so index 0 becomes the first key term.
      if (withDragHint && index === 0) {
        setWithDragHint(false)
        markAvatarHintSeen()
        setBubble({ index: 0, ...place })
        return
      }
      setBubble({ index: (index + 1) % count, ...place })
    }, shown ? BUBBLE_TIME : BUBBLE_DELAY)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- markAvatarHintSeen is recreated on every render
  }, [shown, index, count, still, withDragHint])
  const text = texts[Math.min(index, count - 1)]

  return (
    <div
      ref={wrapperRef}
      role="button"
      tabIndex={0}
      aria-label={frame.avatarMove}
      aria-describedby={hintId}
      className={`flex cursor-grab touch-none flex-col items-center gap-1 rounded-card select-none data-dragging:cursor-grabbing data-moved:z-20 ${className}`}
      {...dragHandlers}
      onPointerDown={(event) => {
        dropDragHint()
        dragHandlers.onPointerDown(event)
      }}
      onKeyDown={(event) => {
        if (event.key.startsWith('Arrow')) dropDragHint()
        dragHandlers.onKeyDown(event)
      }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Avatar
        ref={svgRef}
        // Without Web Audio there is no volume to read: fall back to the avatar's talk loop.
        talk={talking && !analyser ? 'loop' : 'external'}
        // DataMind thinks while it is quiet; the cloud goes away as soon as it speaks.
        thinking={!talking}
        width={Math.round(robot * AVATAR_SCALE.x)}
        height={Math.round(robot * AVATAR_SCALE.y)}
        // Leans while carried (--pet-tilt, set by usePetDrag), pivoting on its feet.
        className="group origin-bottom transition-[rotate] duration-200 ease-out rotate-(--pet-tilt)"
        style={restingPose}
      />
      <span className="rounded-full bg-ink px-3 py-1 text-[14px] leading-tight font-medium text-white">
        DataMind
      </span>
      {/* Decorative: the key terms are already in the screen's content, and the drag
          instruction for assistive technology is the sr-only text below. The key makes
          each new text play its entrance. */}
      {bubble && text && (
        <>
          {/* The outer span only places the bubble; the inner one is the bubble itself,
              so its entrance does not fight the translate that centres it. */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute ${hintAlign[bubble.align]} ${bubble.side === 'above' ? 'bottom-full mb-2.5' : 'top-full mt-2.5'}`}
          >
            <span
              data-avatar-bubble
              className="enter-0 enter-pop flex items-center gap-1.5 rounded-card border border-white/25 bg-ink px-3 py-1.5 text-[12px] leading-tight font-medium whitespace-nowrap text-white"
            >
              <Sparkles size={12} className="shrink-0 text-signal" />
              <BubbleWord text={text} />
            </span>
          </span>
          {/* The tail points at DataMind itself, wherever the bubble is aligned */}
          <span
            aria-hidden="true"
            className={`enter-0 enter-blur pointer-events-none absolute left-1/2 size-2.5 -translate-x-1/2 rotate-45 bg-ink ${bubble.side === 'above' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'}`}
          />
        </>
      )}
      <span id={hintId} className="sr-only">{frame.avatarMoveHint}</span>
    </div>
  )
}
