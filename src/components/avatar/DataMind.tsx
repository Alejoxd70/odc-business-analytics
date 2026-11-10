import { useId, useRef, type CSSProperties } from 'react'
import { Avatar } from './Avatar'
import { AVATAR_SCALE } from './avatarCanvas'
import { usePetDrag } from './usePetDrag'
import { RESTING_ARM, RESTING_MOUTH, useLipSync } from './useLipSync'
import { frame } from '../../content/frame'
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
}

const restingPose = {
  '--avatar-mouth': RESTING_MOUTH,
  '--avatar-arm-l': RESTING_ARM,
  '--avatar-arm-r': RESTING_ARM,
  '--avatar-held': 0,
  '--pet-tilt': '0deg',
} as CSSProperties

/**
 * The guide avatar. It talks with its audio, and the user can pick it up and leave it
 * anywhere on the screen (one position remembered per screen, in the global state).
 */
export const DataMind = ({ size = 'md', speaking, className = '' }: DataMindProps) => {
  const robot = robotSizes[size]
  const hintId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { isPlaying, analyser } = useAudioState()
  const { state, setAvatarOffset } = useNavigation()
  const talking = speaking ?? isPlaying

  useLipSync(svgRef, { active: talking, analyser })
  const dragHandlers = usePetDrag({
    wrapperRef,
    svgRef,
    saved: state.avatarOffsets?.[state.current] ?? null,
    onChange: offset => setAvatarOffset(state.current, offset),
  })

  return (
    <div
      ref={wrapperRef}
      role="button"
      tabIndex={0}
      aria-label={frame.avatarMove}
      aria-describedby={hintId}
      className={`flex cursor-grab touch-none flex-col items-center gap-1 rounded-card select-none data-dragging:cursor-grabbing data-moved:z-20 ${className}`}
      {...dragHandlers}
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
      <span id={hintId} className="sr-only">{frame.avatarMoveHint}</span>
    </div>
  )
}
