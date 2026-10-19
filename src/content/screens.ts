export type ScreenSection
  = | 'entrada'
    | 'modulo-1'
    | 'modulo-2'
    | 'modulo-3'
    | 'modulo-4'
    | 'cierre'

export type ScreenMeta = {
  number: number
  id: `p${string}`
  section: ScreenSection
  label: string
  hasAvatar: boolean
  audio: `pantalla-${string}.mp3` | null
}

export const screens: ScreenMeta[] = [
  { number: 1, id: 'p01', section: 'entrada', label: 'Portada', hasAvatar: true, audio: 'pantalla-01.mp3' },
  { number: 2, id: 'p02', section: 'entrada', label: 'Primera entrada: resultado de aprendizaje y población objetivo', hasAvatar: true, audio: 'pantalla-02.mp3' },
  { number: 3, id: 'p03', section: 'entrada', label: 'Menú del recorrido', hasAvatar: true, audio: 'pantalla-03.mp3' },
  { number: 4, id: 'p04', section: 'modulo-1', label: 'Por qué el dato va primero (infografía EMICRON)', hasAvatar: true, audio: 'pantalla-04.mp3' },
  { number: 5, id: 'p05', section: 'modulo-1', label: 'Evidencia internacional y actividad de verdadero o falso', hasAvatar: true, audio: 'pantalla-05.mp3' },
  { number: 6, id: 'p06', section: 'modulo-2', label: 'Los cuatro estados del dato (escalera)', hasAvatar: true, audio: 'pantalla-06.mp3' },
  { number: 7, id: 'p07', section: 'modulo-2', label: 'Actividad: clasificar cuatro casos arrastrando y soltando', hasAvatar: true, audio: 'pantalla-07.mp3' },
  { number: 8, id: 'p08', section: 'modulo-3', label: 'Cinco prácticas de preparación', hasAvatar: true, audio: 'pantalla-08.mp3' },
  { number: 9, id: 'p09', section: 'modulo-3', label: 'Evidencia de efecto y actividad: ordenar los pasos', hasAvatar: true, audio: 'pantalla-09.mp3' },
  { number: 10, id: 'p10', section: 'modulo-3', label: 'Rutas de entrada de bajo umbral', hasAvatar: true, audio: 'pantalla-10.mp3' },
  { number: 11, id: 'p11', section: 'modulo-4', label: 'Gobierno mínimo y gráfico de antes y después', hasAvatar: true, audio: 'pantalla-11.mp3' },
  { number: 12, id: 'p12', section: 'modulo-4', label: 'Caso de monitoreo y actividad de selección', hasAvatar: true, audio: 'pantalla-12.mp3' },
  { number: 13, id: 'p13', section: 'cierre', label: 'Evaluación final (6 minicasos)', hasAvatar: true, audio: 'pantalla-13.mp3' },
  { number: 14, id: 'p14', section: 'cierre', label: 'Conclusión', hasAvatar: true, audio: 'pantalla-14.mp3' },
  { number: 15, id: 'p15', section: 'cierre', label: 'Referencias', hasAvatar: false, audio: null },
  { number: 16, id: 'p16', section: 'cierre', label: 'Créditos', hasAvatar: false, audio: null },
]
