import { useRef, type CSSProperties } from 'react'
import { Avatar } from './Avatar'
import { RESTING_MOUTH, useLipSync } from './useLipSync'
import { useAudioState } from '../../state/audio'

export type DataMindSize = 'sm' | 'md' | 'lg'

const widths: Record<DataMindSize, number> = { sm: 84, md: 120, lg: 146 }

export type DataMindProps = {
  size?: DataMindSize
  /** Fuerza el estado de habla. Por defecto, DataMind habla mientras suena su audio. */
  speaking?: boolean
  className?: string
}

const restingMouth = { '--avatar-mouth': RESTING_MOUTH } as CSSProperties

export const DataMind = ({ size = 'md', speaking, className = '' }: DataMindProps) => {
  const width = widths[size]
  const svgRef = useRef<SVGSVGElement>(null)
  const { isPlaying, analyser } = useAudioState()
  const talking = speaking ?? isPlaying

  useLipSync(svgRef, { active: talking, analyser })

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <Avatar
        ref={svgRef}
        // Sin Web Audio no hay volumen que leer: se usa la animación de habla del avatar.
        mouth={talking && !analyser ? 'loop' : 'external'}
        width={width}
        height={width}
        style={restingMouth}
      />
      <span className="rounded-full bg-ink px-3 py-1 text-[14px] leading-tight font-medium text-white">
        DataMind
      </span>
    </div>
  )
}
