import { useEffect, type RefObject } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

/** Mouth opening at rest: the avatar's original smile. */
export const RESTING_MOUTH = 1

const NOISE_FLOOR = 0.02
const GAIN = 5
const MIN_OPEN = 0.25
const ATTACK = 0.5
const RELEASE = 0.2

/**
 * Moves the avatar's mouth with the audio volume (not phoneme lip sync).
 * Writes --avatar-mouth straight onto the <svg> every frame, without React renders.
 */
export const useLipSync = (
  svgRef: RefObject<SVGSVGElement | null>,
  { active, analyser }: { active: boolean, analyser: AnalyserNode | null },
) => {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const setMouth = (value: number) => svg.style.setProperty('--avatar-mouth', value.toFixed(3))

    if (!active || !analyser || reducedMotion) {
      setMouth(RESTING_MOUTH)
      return
    }

    const samples = new Uint8Array(analyser.fftSize)
    let level = 0
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
      setMouth(MIN_OPEN + (1 - MIN_OPEN) * level)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      setMouth(RESTING_MOUTH)
    }
  }, [svgRef, active, analyser, reducedMotion])
}
