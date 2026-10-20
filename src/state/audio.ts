import { createContext, useContext } from 'react'

/** Estado de reproducción compartido entre el control de audio y DataMind. */
export type AudioState = {
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  /** Analizador del audio actual; DataMind lee de aquí el volumen para mover la boca. */
  analyser: AnalyserNode | null
  setAnalyser: (analyser: AnalyserNode | null) => void
}

export const AudioStateContext = createContext<AudioState>({
  isPlaying: false,
  setIsPlaying: () => {},
  analyser: null,
  setAnalyser: () => {},
})

export const useAudioState = () => useContext(AudioStateContext)
