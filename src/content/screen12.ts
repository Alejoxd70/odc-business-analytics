import type { MeasureId, ReliabilityLevel } from '../activities/MonitoringSimulator'

const levels: Record<ReliabilityLevel, string> = { low: 'Baja', medium: 'Media', high: 'Alta' }

export const screen12 = {
  title: 'Del dato al monitoreo',
  caseStudy: {
    label: 'Caso: monitoreo energético en una empresa manufacturera',
    steps: [
      'Datos de consumo de cuatro años',
      'Preparación con las prácticas del módulo 3',
      'Detección de anomalías',
    ],
    facts: [
      { value: '125', text: 'anomalías en seis meses, que los expertos de la empresa juzgaron prevenibles' },
      { value: '≈ 3%', text: 'del consumo del periodo, evitable según estimación; no es ahorro realizado' },
    ],
    note: 'El análisis mostró además que el pico de consumo ocurre entre las 9:00 y las 13:00.',
    source: 'Wigger et al. (2025)',
  },
  quote: {
    // The lead is painted in amber; together they form the original sentence.
    lead: 'En microempresas,',
    rest: 'la calidad de los datos sigue limitando lo que la analítica puede ofrecer: un gerente advirtió que la exactitud depende de la calidad de los datos de entrada.',
    source: 'Shahzad et al. (2026)',
  },
  simulator: {
    title: 'Actividad: estabiliza el monitoreo',
    instruction: 'Un taller de costura monitorea la tasa de defectos por lote. Unos operarios registran “unidades defectuosas” y otros “unidades rechazadas”, y nadie revisa la hoja. Cambia de estado las medidas y observa qué pasa con el tablero.',
    legend: { real: 'Unidades defectuosas', rejected: 'Unidades rechazadas', flagged: 'Marcado por el responsable' },
    meterLabel: 'Confiabilidad del monitoreo',
    levels,
    levelText: {
      removed: 'Faltan días de producción real en el tablero.',
      mixed: 'El tablero aún mezcla dos definiciones distintas.',
      medium: 'Los datos se corrigieron, pero nadie evita que el problema vuelva.',
      high: 'Monitoreo confiable y sostenido.',
    },
    measures: [
      {
        id: 'software',
        label: 'Comprar un software de monitoreo',
        feedback: 'El tablero se ve mejor, pero las caídas siguen: un sistema nuevo heredaría el mismo dato inconsistente.',
      },
      {
        id: 'remove',
        label: 'Eliminar los días con caídas bruscas',
        feedback: 'Las caídas desaparecen, pero perdiste tres días de producción real, y la falla reaparecería al día siguiente.',
      },
      {
        id: 'rule',
        label: 'Definir una regla común de registro',
        feedback: 'Con una sola definición, los registros vuelven a ser comparables y las caídas falsas desaparecen.',
      },
      {
        id: 'reviewer',
        label: 'Asignar a alguien que revise la hoja cada semana',
        feedback: 'Un responsable que revisa cada semana detecta lo que se registra mal. Por sí solo no lo corrige: necesita una regla común contra la cual comparar.',
      },
    ] satisfies { id: MeasureId, label: string, feedback: string }[],
    closingFeedback: 'La falla era de definición y de responsabilidad: una regla común y un responsable atacan la causa (Georgescu y Schmuck, 2025).',
    // Illustrative data: defect rate (%) per day. Days 3, 6 and 9 were also recorded as "rejected".
    days: [
      { real: 5.2 },
      { real: 4.8 },
      { real: 5.5, rejected: 1.4 },
      { real: 5.0 },
      { real: 4.9 },
      { real: 5.3, rejected: 1.2 },
      { real: 5.1 },
      { real: 4.7 },
      { real: 5.4, rejected: 1.5 },
      { real: 5.0 },
    ],
    newDashboard: 'Tablero nuevo',
    lostDays: (lost: number, total: number) => `Días perdidos: ${lost} de ${total}`,
    dayLabel: (day: number) => `Día ${day}`,
    dayShort: (day: number) => `D${day}`,
    levelSr: (level: ReliabilityLevel) => `Nivel: ${levels[level]}.`,
    table: { caption: 'Tasa de defectos por día', day: 'Día', value: 'Valor', noData: 'sin dato', flagged: 'marcado' },
    summary: (drops: number, flagged: number, lost: number, level: ReliabilityLevel) =>
      `Días con caídas: ${drops}. Días marcados: ${flagged}. Días perdidos: ${lost}. Confiabilidad: ${levels[level].toLowerCase()}.`,
  },
  transcript: 'Ahora pasamos al monitoreo. En el caso de la izquierda, una empresa manufacturera preparó sus datos de consumo de energía con las prácticas que viste en el módulo tres y los usó para detectar anomalías. En seis meses encontró ciento veinticinco consumos inusuales que sus expertos consideraron prevenibles. Ahora es tu turno. En el simulador, cambia de estado las medidas para el taller de costura y observa qué pasa con su tablero. Tu meta es alcanzar un monitoreo confiable que se sostenga y no sea frágil.',
}
