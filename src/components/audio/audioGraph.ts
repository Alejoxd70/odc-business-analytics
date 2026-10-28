// Web Audio graph that reads the volume of DataMind's audio (mouth sync).
// Outside React: a single AudioContext for the whole session.

let context: AudioContext | null = null
// An <audio> element can only be connected to an AudioContext once.
const analysers = new WeakMap<HTMLAudioElement, AnalyserNode>()

/** Creates the AudioContext on first use. Call only inside a user gesture. */
export const getAudioContext = (): AudioContext | null => {
  if (context) return context
  try {
    context = new AudioContext()
  }
  catch {
    context = null
  }
  return context
}

/**
 * Connects the element to an AnalyserNode (element → analyser → output).
 * Returns null when Web Audio is unavailable: the audio keeps playing the normal way.
 */
export const connectAnalyser = (el: HTMLAudioElement): AnalyserNode | null => {
  const cached = analysers.get(el)
  if (cached) return cached
  const ctx = getAudioContext()
  if (!ctx) return null
  try {
    const source = ctx.createMediaElementSource(el)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 1024
    analyser.smoothingTimeConstant = 0.6
    source.connect(analyser)
    analyser.connect(ctx.destination)
    analysers.set(el, analyser)
    return analyser
  }
  catch {
    return null
  }
}
