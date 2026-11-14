import { createContext, useContext } from 'react'

/** Playback state shared between the audio control and DataMind. */
export type AudioState = {
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  /** Analyser for the current audio; DataMind reads the volume from it to move the mouth. */
  analyser: AnalyserNode | null
  setAnalyser: (analyser: AnalyserNode | null) => void
  /** Playback speed chosen by the user; kept from one screen to the next. */
  rate: number
  setRate: (rate: number) => void
}

export const AudioStateContext = createContext<AudioState>({
  isPlaying: false,
  setIsPlaying: () => {},
  analyser: null,
  setAnalyser: () => {},
  rate: 1,
  setRate: () => {},
})

export const useAudioState = () => useContext(AudioStateContext)
