import { useEffect, type RefObject } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

/** Mouth opening at rest: the avatar's original smile. */
export const RESTING_MOUTH = 1
/** Arms at rest: hanging in their default pose. */
export const RESTING_ARM = 0

const NOISE_FLOOR = 0.02
const GAIN = 5
const MIN_OPEN = 0.25
const ATTACK = 0.5
const RELEASE = 0.2

// Arms are gestures, not lip sync: slower than the mouth and only on emphasis.
const ARM_THRESHOLD = 0.2
const ARM_ATTACK = 0.25
const ARM_RELEASE = 0.06
/** The right arm repeats the left one a few frames later, a bit smaller, so they don't mirror. */
const ARM_LAG_FRAMES = 8
const ARM_ECHO = 0.8

/** How far the arms rise for a smoothed voice level (0–1): nothing below the threshold. */
export const armLift = (level: number) =>
  Math.min(Math.max((level - ARM_THRESHOLD) / (1 - ARM_THRESHOLD), 0), 1)

/**
 * Moves the avatar's mouth and arms with the audio volume (not phoneme lip sync).
 * Writes --avatar-mouth, --avatar-arm-l and --avatar-arm-r straight onto the <svg>
 * every frame, without React renders.
 */
export const useLipSync = (
  svgRef: RefObject<SVGSVGElement | null>,
  { active, analyser }: { active: boolean, analyser: AnalyserNode | null },
) => {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const set = (name: string, value: number) => svg.style.setProperty(name, value.toFixed(3))
    const rest = () => {
      set('--avatar-mouth', RESTING_MOUTH)
      set('--avatar-arm-l', RESTING_ARM)
      set('--avatar-arm-r', RESTING_ARM)
    }

    if (!active || !analyser || reducedMotion) {
      rest()
      return
    }

    const samples = new Uint8Array(analyser.fftSize)
    const armHistory = new Array<number>(ARM_LAG_FRAMES).fill(0)
    let level = 0
    let arm = 0
    let frame = 0

    const tick = () => {
      analyser.getByteTimeDomainData(samples)
      let sum = 0
      for (const s of samples) {
        const v = (s - 128) / 128
        sum += v * v
      }
      const rms = Math.sqrt(sum / samples.length)
      const target = Math.min(Math.max((rms - NOISE_FLOOR) * GAIN, 0), 1)
      level += (target - level) * (target > level ? ATTACK : RELEASE)
      set('--avatar-mouth', MIN_OPEN + (1 - MIN_OPEN) * level)

      const armTarget = armLift(level)
      arm += (armTarget - arm) * (armTarget > arm ? ARM_ATTACK : ARM_RELEASE)
      armHistory.push(arm)
      set('--avatar-arm-l', arm)
      set('--avatar-arm-r', (armHistory.shift() ?? 0) * ARM_ECHO)

      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      rest()
    }
  }, [svgRef, active, analyser, reducedMotion])
}
