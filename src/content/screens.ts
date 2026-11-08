export type ScreenSection
  = | 'intro'
    | 'module-1'
    | 'module-2'
    | 'module-3'
    | 'module-4'
    | 'closing'

export type ScreenMeta = {
  number: number
  id: `s${string}`
  section: ScreenSection
  label: string
  hasAvatar: boolean
  audio: `screen-${string}.mp3` | null
}

export const screens: ScreenMeta[] = [
  { number: 1, id: 's01', section: 'intro', label: 'Inicio', hasAvatar: true, audio: 'screen-01.mp3' },
  { number: 2, id: 's02', section: 'intro', label: 'Resultado de aprendizaje y población objetivo', hasAvatar: true, audio: 'screen-02.mp3' },
  { number: 3, id: 's03', section: 'intro', label: 'Este será tu recorrido que te llevará del registro al análisis', hasAvatar: true, audio: 'screen-03.mp3' },
  { number: 4, id: 's04', section: 'module-1', label: '¿Por qué los datos o información son muy importantes?', hasAvatar: true, audio: 'screen-04.mp3' },
  { number: 5, id: 's05', section: 'module-1', label: 'No es un problema que pasa solo en Colombia', hasAvatar: true, audio: 'screen-05.mp3' },
  { number: 6, id: 's06', section: 'module-2', label: '¿En qué fase se encuentra la empresa?', hasAvatar: true, audio: 'screen-06.mp3' },
  { number: 7, id: 's07', section: 'module-2', label: 'Actividad: clasificar los casos por estado del dato', hasAvatar: true, audio: 'screen-07.mp3' },
  { number: 8, id: 's08', section: 'module-3', label: '¿Cómo se preparan y gestionan los datos?', hasAvatar: true, audio: 'screen-08.mp3' },
  { number: 9, id: 's09', section: 'module-3', label: '¿La preparación cambia el resultado?', hasAvatar: true, audio: 'screen-09.mp3' },
  { number: 10, id: 's10', section: 'module-3', label: '¿Y si la empresa parte de un cuaderno?', hasAvatar: true, audio: 'screen-10.mp3' },
  { number: 11, id: 's11', section: 'module-4', label: '¿Cómo se sostiene y se monitorea?', hasAvatar: true, audio: 'screen-11.mp3' },
  { number: 12, id: 's12', section: 'module-4', label: 'Del dato al monitoreo', hasAvatar: true, audio: 'screen-12.mp3' },
  { number: 13, id: 's13', section: 'closing', label: 'Evaluación final: crucigrama', hasAvatar: true, audio: 'screen-13.mp3' },
  { number: 14, id: 's14', section: 'closing', label: 'Recorriste el camino del registro al análisis', hasAvatar: true, audio: 'screen-14.mp3' },
  { number: 15, id: 's15', section: 'closing', label: 'Referencias', hasAvatar: false, audio: null },
  { number: 16, id: 's16', section: 'closing', label: 'Créditos', hasAvatar: false, audio: null },
]
