import type { CrosswordWord, Direction } from '../activities/crosswordLogic'

const directionName: Record<Direction, string> = { across: 'horizontal', down: 'vertical' }

/** "el módulo 3", "los módulos 2 y 3", "los módulos 1, 2 y 3". */
export const modulesPhrase = (modules: number[]) => {
  if (modules.length === 1) return `el módulo ${modules[0]}`
  return `los módulos ${modules.slice(0, -1).join(', ')} y ${modules[modules.length - 1]}`
}

export const screen13 = {
  label: 'Evaluación final',
  title: 'Evaluación final: crucigrama',
  intro: 'Cada pista es un caso: diagnostica la situación y escribe la palabra. Alcanzas el resultado con al menos cinco palabras correctas.',
  crossword: {
    gridLabel: 'Cuadrícula del crucigrama',
    cluesLabel: 'Pistas',
    check: 'Comprobar',
    groups: { across: 'Horizontales', down: 'Verticales' } satisfies Record<Direction, string>,
    // Answers without accents: they are compared normalized.
    words: [
      {
        number: 1,
        direction: 'across',
        answer: 'RESPONSABLE',
        row: 0,
        col: 1,
        module: 4,
        clue: 'Cada área calcula el tiempo de entrega a su manera y el tablero no cuadra. Se necesita una definición común y un ______ del dato.',
        feedback: 'Sin una definición común y un responsable, cualquier herramienta mostrará cifras que no cuadran (Georgescu y Schmuck, 2025).',
      },
      {
        number: 3,
        direction: 'across',
        answer: 'DIAGNOSTICO',
        row: 2,
        col: 1,
        module: 1,
        clue: 'Una gerente quiere un tablero la próxima semana, pero anota los pedidos en una libreta. Primero recomiendas un ______ de los datos.',
        feedback: 'El primer paso no es qué herramienta usar, sino qué datos existen: un tablero construido sobre un registro desconocido hereda sus problemas.',
      },
      {
        number: 4,
        direction: 'across',
        answer: 'EXCLUIR',
        row: 4,
        col: 2,
        module: 3,
        clue: 'Encuentras lotes con más unidades defectuosas que producidas. Son imposibles para el negocio: la decisión es ______ esos registros con una regla declarada.',
        feedback: 'Un valor imposible para el negocio se excluye con una regla declarada; lo inusual se investiga (Uslu y Büyüklü, 2024).',
      },
      {
        number: 6,
        direction: 'across',
        answer: 'FRAGMENTADO',
        row: 8,
        col: 0,
        module: 2,
        clue: 'Una ferretería factura en un software, lleva el inventario en una hoja de cálculo y los pedidos en WhatsApp. Su registro está ______.',
        feedback: 'Los datos existen, pero en tres fuentes que no se conectan entre sí (Eiden et al., 2020).',
      },
      {
        number: 2,
        direction: 'down',
        answer: 'EVIDENCIAS',
        row: 0,
        col: 2,
        module: 2,
        clue: 'El dueño asegura que sus datos “están perfectos”. Verificas cómo, dónde y en qué formato registra. Por eso, el diagnóstico se basa en ______.',
        feedback: 'La autoevaluación tiende a sobrestimar la calidad de los datos; el diagnóstico se basa en lo que se observa (Beckschulte et al., 2023, como se citó en Müller-Stein et al., 2025).',
      },
      {
        number: 5,
        direction: 'down',
        answer: 'PAGOS',
        row: 5,
        col: 10,
        module: 3,
        clue: 'Un taller de celulares no lleva registros, pero cobra casi todo por transferencia y QR. Puede empezar con los datos de sus ______ digitales.',
        feedback: 'Cuando un tercero ya captura el dato, se puede empezar sin cambiar la forma de trabajar (Marjudi et al., 2023).',
      },
    ] satisfies CrosswordWord[],
    // Cases are numbered 1 to 6 in the panel's order; the module to review is in the feedback.
    caseLabel: (n: number) => `Caso ${n}`,
    length: (n: number) => `(${n})`,
    correctSr: 'correcta',
    reviewModule: (module: number) => `Repasa el módulo ${module}.`,
    cellPart: (number: number, direction: Direction, index: number, length: number) =>
      `${number} ${directionName[direction]}, letra ${index} de ${length}`,
    // Status line: "{n} de 6" in weight 500, then the rest.
    statusCount: (correct: number, total: number) => `${correct} de ${total}`,
    statusRest: 'palabras correctas. Necesitas al menos 5.',
    passed: 'Alcanzaste el resultado de aprendizaje.',
    failed: (modules: number[]) => `Aún no alcanzas el resultado. Te sugiero repasar ${modulesPhrase(modules)} e intentarlo de nuevo.`,
    moduleButton: (module: number) => `Módulo ${module}`,
    retry: 'Intentar de nuevo',
  },
  transcript: 'Llegamos a la evaluación final, la cual consiste en un crucigrama de seis casos. Para encontrar cada palabra, primero diagnostica la situación de la empresa. Escribe en la cuadrícula y presiona Comprobar. Si aciertas al menos cinco palabras, habrás alcanzado el resultado. Si no, te diré qué módulos repasar y podrás intentarlo de nuevo.',
}
