import { useState, type ReactNode } from 'react'
import { AudioStateContext } from './audio'

export const AudioStateProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [rate, setRate] = useState(1)
  return (
    <AudioStateContext value={{ isPlaying, setIsPlaying, analyser, setAnalyser, rate, setRate }}>
      {children}
    </AudioStateContext>
  )
}
