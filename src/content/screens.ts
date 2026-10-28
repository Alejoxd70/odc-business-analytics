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
  { number: 1, id: 's01', section: 'intro', label: 'Portada', hasAvatar: true, audio: 'screen-01.mp3' },
  { number: 2, id: 's02', section: 'intro', label: 'Primera entrada: resultado de aprendizaje y población objetivo', hasAvatar: true, audio: 'screen-02.mp3' },
  { number: 3, id: 's03', section: 'intro', label: 'Menú del recorrido', hasAvatar: true, audio: 'screen-03.mp3' },
  { number: 4, id: 's04', section: 'module-1', label: 'Por qué el dato va primero (infografía EMICRON)', hasAvatar: true, audio: 'screen-04.mp3' },
  { number: 5, id: 's05', section: 'module-1', label: 'Evidencia internacional y actividad de verdadero o falso', hasAvatar: true, audio: 'screen-05.mp3' },
  { number: 6, id: 's06', section: 'module-2', label: 'Los cuatro estados del dato (escalera)', hasAvatar: true, audio: 'screen-06.mp3' },
  { number: 7, id: 's07', section: 'module-2', label: 'Actividad: clasificar cuatro casos arrastrando y soltando', hasAvatar: true, audio: 'screen-07.mp3' },
  { number: 8, id: 's08', section: 'module-3', label: 'Cinco prácticas de preparación', hasAvatar: true, audio: 'screen-08.mp3' },
  { number: 9, id: 's09', section: 'module-3', label: 'Evidencia de efecto y actividad: ordenar los pasos', hasAvatar: true, audio: 'screen-09.mp3' },
  { number: 10, id: 's10', section: 'module-3', label: 'Rutas de entrada de bajo umbral', hasAvatar: true, audio: 'screen-10.mp3' },
  { number: 11, id: 's11', section: 'module-4', label: 'Gobierno mínimo y gráfico de antes y después', hasAvatar: true, audio: 'screen-11.mp3' },
  { number: 12, id: 's12', section: 'module-4', label: 'Caso de monitoreo y actividad de selección', hasAvatar: true, audio: 'screen-12.mp3' },
  { number: 13, id: 's13', section: 'closing', label: 'Evaluación final (6 minicasos)', hasAvatar: true, audio: 'screen-13.mp3' },
  { number: 14, id: 's14', section: 'closing', label: 'Conclusión', hasAvatar: true, audio: 'screen-14.mp3' },
  { number: 15, id: 's15', section: 'closing', label: 'Referencias', hasAvatar: false, audio: null },
  { number: 16, id: 's16', section: 'closing', label: 'Créditos', hasAvatar: false, audio: null },
]
