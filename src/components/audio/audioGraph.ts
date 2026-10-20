// Grafo de Web Audio para leer el volumen del audio de DataMind (sincronía de la boca).
// Fuera de React: un único AudioContext para toda la sesión.

let context: AudioContext | null = null
// Un <audio> solo se puede conectar una vez a un AudioContext.
const analysers = new WeakMap<HTMLAudioElement, AnalyserNode>()

/** Crea el AudioContext la primera vez. Llamar solo dentro de un gesto del usuario. */
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
 * Conecta el elemento a un AnalyserNode (elemento → analyser → salida).
 * Devuelve null si Web Audio no está disponible: el audio sigue sonando por la vía normal.
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
