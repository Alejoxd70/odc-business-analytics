import type { ClassifyCase } from '../activities/ClassifyActivity'

export const screen07 = {
  title: 'Actividad',
  instruction: 'Arrastra cada caso al estado del dato que corresponde. Al soltarlo, verás si acertaste y por qué.',
  cases: [
    {
      id: 'bakery',
      name: 'Panadería de barrio',
      description: 'Anota en un cuaderno las ventas del día y los fiados; a fin de mes suma a mano.',
      correctState: 2,
      correctFeedback: 'Hay registro, pero en papel y sin estructura: para analizarlo habría que transcribirlo y ordenarlo. Corresponde al 27,1% de micronegocios que llevan sus cuentas en cuaderno, hoja de cálculo o caja registradora (DANE, 2025).',
      reviewFeedback: 'Sí hay registro, pero en papel y sin estructura no se puede analizar.',
    },
    {
      id: 'sewing',
      name: 'Taller de costura',
      description: 'Registra cada lote en una hoja de cálculo con formato fijo: fecha, operario y unidades defectuosas.',
      correctState: 4,
      correctFeedback: 'Una hoja de cálculo con formato fijo y campos consistentes ya permite el tipo de análisis de defectos por operario y máquina que documentan Kang y Zhong (2023).',
      reviewFeedback: 'El formato es simple, pero estructurado y constante. Lo que define el estado es lo que se puede hacer con el dato.',
    },
    {
      id: 'distributor',
      name: 'Comercializadora',
      description: 'Factura en un software, lleva el inventario en Excel y recibe pedidos por WhatsApp; nada se conecta.',
      correctState: 3,
      correctFeedback: 'Los datos existen, pero en tres fuentes que no se conectan. En las PYMES es frecuente que información clave esté solo en archivos de oficina (Eiden et al., 2020).',
      reviewFeedback: 'Tener un software no basta. Si la facturación, el inventario y los pedidos no se conectan, el dato está dividido.',
    },
    {
      id: 'welding',
      name: 'Taller de soldadura',
      description: 'No realiza un registro de movimientos o clientes.',
      correctState: 1,
      correctFeedback: 'Sin huella de las operaciones no hay dato que preparar: el primer paso es empezar a registrar. Es la situación del 68,2% de los micronegocios colombianos (DANE, 2025).',
      reviewFeedback: 'No hay registro de ventas ni gastos. Sin registro, no hay dato.',
    },
  ] satisfies ClassifyCase[],
  transcript: 'Llegó el momento de diagnosticar. Tienes cuatro empresas y cuatro estados. Arrastra cada caso al estado que le corresponde. Al soltarlo, verás si acertaste y por qué. A veces una empresa con software de facturación puede estar en peor situación que una con una hoja de cálculo bien diseñada. Si recomiendas una herramienta sin saber en qué fase está la empresa, lo más probable es que la inversión no sirva.',
}
