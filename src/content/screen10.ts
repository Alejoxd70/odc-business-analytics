import type { DataStateId } from './states'

const conjunction = new Intl.ListFormat('es', { type: 'conjunction' })
const stateLabel = (state: DataStateId) => `estado ${state}`

export const screen10 = {
  title: '¿Y si la empresa parte de un cuaderno?',
  intro: 'No todo empieza con un sistema. La literatura documenta rutas de entrada que no exigen cambiar bruscamente la forma de trabajar.',
  servesIn: 'Sirve en',
  stateLabel,
  /** Accessible text of the state pills: "Sirve en estado 1 y estado 2". */
  servesInText: (states: DataStateId[]) => `Sirve en ${conjunction.format(states.map(stateLabel))}`,
  routes: [
    {
      title: 'Plantilla estructurada en hoja de cálculo',
      description: 'Campos fijos convierten el registro informal en datos analizables, sin software nuevo. Se eligió Excel por estar disponible y ser comprensible en cualquier lugar de trabajo.',
      source: 'Ghosh et al. (2023)',
      states: [1, 2],
    },
    {
      title: 'Aprovechar los datos que otros ya capturan',
      description: 'Se analizaron 353 microempresas con los datos de una pasarela de pagos, sin que cambiaran su forma de trabajar. En Colombia, la facturación electrónica podría cumplir un papel similar.',
      source: 'Marjudi et al. (2023)',
      states: [1, 2],
    },
    {
      title: 'Conectar lo que ya vive en archivos de oficina',
      description: 'En PYMES industriales, listas de materiales y planes de trabajo existen a veces solo en archivos de Office; la solución debe conectarlos en lugar de exigir migrarlos.',
      source: 'Eiden et al. (2020)',
      states: [3],
    },
    {
      title: 'Automatizar la extracción de sistemas sin API',
      description: 'Un robot de software replica las operaciones humanas para extraer datos de un sistema heredado sin interfaz programable.',
      source: 'Suebsing (2026)',
      states: [3],
    },
    {
      title: 'Desplegar por módulos',
      description: 'Empezar por integración de datos y recomendación, y dejar el resto en los sistemas existentes, reduce la barrera técnica para una PYME.',
      source: 'Li et al. (2026)',
      states: [3, 4],
    },
  ] satisfies { title: string, description: string, source: string, states: DataStateId[] }[],
  checklist: {
    title: 'Antes de adoptar una herramienta: cuatro preguntas',
    text: 'En la revisión que sustenta este recurso, varios documentos proponían soluciones para PYMES sin haberlas probado en ninguna.',
    questions: [
      '¿Fue probada en empresas reales o solo propuesta?',
      '¿De qué tamaño eran esas empresas, y se parecen a la que acompañas?',
      '¿Los resultados son medidos o estimados?',
      '¿Quién la evaluó: un tercero o los mismos que la desarrollaron?',
    ],
  },
  transcript: '¿Y si la empresa apenas tiene un cuaderno? No todo empieza con un sistema. La literatura documenta rutas de entrada que no exigen cambiar bruscamente la forma de trabajar: una plantilla bien diseñada en una hoja de cálculo, los datos que ya registra un tercero, la conexión con los archivos de oficina donde muchas empresas guardan su información o un despliegue por partes.',
}
