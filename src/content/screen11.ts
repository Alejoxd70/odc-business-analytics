import type { DumbbellItem } from '../components/charts/DumbbellChart'

export const screen11 = {
  purpose: 'Relacionar el gobierno de datos con la capacidad de monitorear procesos de forma sostenida.',
  info: [
    {
      label: '¿Qué es un custodio de datos?',
      body: 'Es la persona responsable de mantener la calidad de un conjunto de datos en el día a día. Esta persona verifica que se registre según lo acordado y corrige los errores. En el caso de Georgescu y Schmuck (2025), asignar propietarios y custodios permitió que el 80% de los custodios tuviera roles más claros.',
    },
    {
      label: 'Un predictor fuerte',
      body: 'En 287 PYMES chinas, el gobierno de datos fue el predictor más fuerte del modelo, por encima de la cultura orientada a datos (Rixin et al., 2025). Cabe tener en cuenta que el estudio solo incluyó empresas que ya usaban analítica, así que mide lo que le sirve a quien ya está involucrado en el proceso, no cómo se empieza.',
    },
  ],
  governance: {
    title: 'Gobierno mínimo para una PYME',
    items: [
      'Cada dato clave tiene una persona responsable de mantenerlo.',
      'Existe una definición escrita de qué se registra y cómo.',
      'Hay reglas que marcan los valores imposibles para el negocio.',
      'Alguien revisa los datos con una frecuencia fija.',
      'La dirección conoce y respalda estas reglas.',
    ],
    note: 'Elaborado a partir de Georgescu y Schmuck (2025)',
  },
  chart: {
    title: 'Antes y después de implementar gobierno de datos',
    legend: { before: 'Antes', after: 'Después' },
    connector: 'a',
    srValue: (before: number, after: number) => `De ${before}% antes a ${after}% después`,
    items: [
      { label: 'Decisiones basadas en datos', before: 54, after: 72 },
      { label: 'Disponibilidad de datos', before: 68, after: 85 },
      { label: 'Cumplimiento de estándares internos', before: 48, after: 73 },
      { label: 'Retrabajo por errores de datos', before: 18, after: 8 },
    ] satisfies DumbbellItem[],
    note: 'PYME de 350 a 750 empleados; estos indicadores son reportados por la propia organización. Georgescu y Schmuck (2025)',
  },
  transcript: 'En este último módulo respondemos una pregunta esencial: ¿Cómo se logra que el monitoreo sea estable? La respuesta que documenta la literatura es el gobierno de datos, que incluye reglas, responsables y estándares que mantienen la calidad de los datos en el tiempo. Mira la gráfica: se implementó un gobierno de datos y, con esto, la proporción de decisiones basadas en datos pasó de cincuenta y cuatro a setenta y dos por ciento, y el retrabajo por errores bajó de dieciocho a ocho por ciento.',
}
