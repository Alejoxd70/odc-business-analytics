import { dataStates } from './states'

const details = [
  { description: 'Las operaciones no dejan huella escrita ni digital.', source: 'DANE (2025)' },
  { description: 'Hay datos en cuaderno u hojas de cálculo, pero no se sabe qué recolectar ni cómo analizarlos.', source: 'Mohamed y Weber (2020)' },
  { description: 'Los datos existen en sistemas y archivos que no se conectan entre sí.', source: 'Eiden et al. (2020); Marosi et al. (2022)' },
  { description: 'Datos estructurados, accesibles y con reglas mínimas de calidad.', source: 'Wigger et al. (2025)' },
]

export const screen06 = {
  paragraphs: [
    'Antes de proponer una solución analítica hay que saber de qué datos se inicia. La revisión permite distinguir cuatro estados, desde la ausencia de registro hasta datos listos para el monitoreo.',
    'No es un modelo de madurez, sino una evaluación práctica de diagnóstico. Se puede aplicar por proceso, ya que una empresa puede facturar en un software y llevar el inventario en un cuaderno.',
  ],
  info: [
    {
      label: 'Cuidado con la autoevaluación',
      body: 'Un estudio encontró que el 77% de las empresas calificaba sus datos como buenos o muy buenos, pero solo el 9% alcanzaba objetivamente ese nivel (Beckschulte et al., 2023, citado en Müller-Stein et al., 2025). Por eso el diagnóstico se basa en evidencias observables (cómo, dónde y en qué formato se registra) y no en la percepción de la empresa.',
    },
    {
      label: 'Los modelos de madurez y los datos',
      body: 'Una revisión sistemática de 18 modelos de madurez analítica encontró que la gestión de datos es frecuentemente omitida: dos de los tres modelos diseñados para PYMES no la incluyen (Marohn y Li, 2024). El modelo colombiano SIGET PROS, por ejemplo, evalúa personas, estructura, gestión y entorno (Guardia Silva et al., 2022).',
    },
  ],
  stairsLabel: 'Los cuatro estados del dato',
  states: dataStates.map((state, i) => ({ ...state, ...details[i] })),
  transcript: 'En este módulo cambias de rol: ya no se trata de saber que el problema existe, sino de reconocerlo cuando está presente. Mira los estados de los datos: son cuatro y se desprenden de la literatura revisada. En el primero, las operaciones no dejan ninguna huella. En el segundo, hay registros en cuaderno. En el tercero, los datos existen, pero están repartidos. Y en el cuarto, los datos están estructurados y listos para monitorear.',
}
