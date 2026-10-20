declare module 'virtual:audio-manifest' {
  /** Nombres de los mp3 presentes en public/audio al compilar (o al arrancar pnpm dev). */
  const files: string[]
  export default files
}
