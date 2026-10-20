import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { existsSync, readdirSync } from 'node:fs'
import { normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

// Lista los mp3 presentes en public/audio. Así el control de audio sabe de antemano
// qué archivos faltan y nunca los pide (un 404 deja un error en consola imposible de silenciar).
const audioManifest = (): Plugin => {
  const id = 'virtual:audio-manifest'
  const resolvedId = `\0${id}`
  const dir = normalize(fileURLToPath(new URL('./public/audio', import.meta.url)))

  return {
    name: 'odc-audio-manifest',
    resolveId: source => (source === id ? resolvedId : undefined),
    load(loadId) {
      if (loadId !== resolvedId) return
      const files = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.mp3')) : []
      return `export default ${JSON.stringify(files)}`
    },
    configureServer(server) {
      server.watcher.add(dir)
      const onChange = (file: string) => {
        if (!normalize(file).startsWith(dir)) return
        const mod = server.moduleGraph.getModuleById(resolvedId)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    audioManifest(),
  ],
})
