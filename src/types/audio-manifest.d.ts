declare module 'virtual:audio-manifest' {
  /** Names of the mp3 files in public/audio at build time (or when pnpm dev starts). */
  const files: string[]
  export default files
}
