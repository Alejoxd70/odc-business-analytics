export type SegmentTone = 'ink' | 'rule-strong' | 'data'

export const screen04 = {
  paragraphs: [
    'La analítica de negocio transforma datos en decisiones. Pero antes de cualquier práctica hay una condición. Dicha condición es que los datos existan, se puedan leer y sean confiables.',
    'En Colombia, esa condición no está garantizada. La Encuesta de Micronegocios del DANE muestra que casi siete de cada diez micronegocios no llevan ningún registro de sus cuentas y que solo uno de cada veinte usa un método formal (DANE, 2025).',
  ],
  info: [
    {
      label: 'Business Analytics',
      body: 'Se define como el uso de datos para realizar un análisis, modelos explicativos o predictivos y gestión que se basa en hechos para orientar decisiones (Davenport y Harris, 2007, citado en Hayajneh et al., 2022). Va del nivel descriptivo, qué pasó, al prescriptivo, qué conviene hacer.',
    },
    {
      label: '¿Qué es EMICRON?',
      body: 'La Encuesta de Micronegocios del DANE analiza las entidades económicas de hasta nueve personas trabajadoras. Su edición 2024 estimó al menos 5.297.252 micronegocios en el país (DANE, 2025).',
    },
  ],
  infographic: {
    title: 'Micronegocios en Colombia, 2024',
    subtitle: '5,3 millones de unidades económicas de hasta 9 personas',
    headline: { value: '68,2%', text: 'no lleva ningún registro de sus cuentas' },
    segments: [
      { share: 68.2, label: '68,2% sin ningún registro', tone: 'ink' },
      { share: 27.1, label: '27,1% en cuaderno, hoja de cálculo o caja registradora', tone: 'rule-strong' },
      { share: 4.7, label: '4,7% con un método contable formal', tone: 'data' },
    ] satisfies { share: number, label: string, tone: SegmentTone }[],
    facts: [
      { value: '89,1%', text: 'no usó computador, tableta ni portátil' },
      { value: '50,4%', text: 'no usó internet para su actividad' },
    ],
    source: 'Fuente: DANE (2025), Encuesta de Micronegocios 2024',
  },
  transcript: 'Te doy la bienvenida al primer módulo. Aquí vamos a responder una pregunta: ¿Por qué los datos o información son muy importantes? La analítica transforma la información en decisiones, pero solo si esta misma existe y se puede gestionar. Puedes dar clic en los botones de más información para ver qué es la analítica de negocio y de dónde salen estas cifras.',
}
