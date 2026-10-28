/** Single source for the modules: menu, module screens and conclusion. */
export type ModuleMeta = {
  number: number
  label: string
  question: string
  /** First screen of the module. */
  start: number
  /** All screens of the module (to know whether it was visited). */
  screens: number[]
}

export const modules: ModuleMeta[] = [
  { number: 1, label: 'Módulo 1', question: '¿Por qué los datos o información son muy importantes?', start: 4, screens: [4, 5] },
  { number: 2, label: 'Módulo 2', question: '¿En qué fase se encuentra la empresa?', start: 6, screens: [6, 7] },
  { number: 3, label: 'Módulo 3', question: '¿Cómo se preparan y gestionan los datos?', start: 8, screens: [8, 9, 10] },
  { number: 4, label: 'Módulo 4', question: '¿Cómo se sostiene y se monitorea?', start: 11, screens: [11, 12] },
]

export const isModuleVisited = (module: ModuleMeta, visited: number[]) =>
  module.screens.some(screen => visited.includes(screen))
