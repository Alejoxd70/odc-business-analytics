export const screen08 = {
  purpose: 'Seleccionar prácticas de preparación pertinentes según el estado del dato y el proceso que se quiere monitorear. Estas prácticas provienen de estudios que documentan decisiones concretas sobre datos reales de empresas.',
  info: [
    {
      label: '¿Imputar o eliminar?',
      body: 'No hay una respuesta única: la decisión debe justificarse. Wigger et al. (2025) eliminaron los registros incompletos en lugar de imputarlos porque los faltantes eran pocos, no seguían un patrón sistemático y los datos originales tenían resolución de minuto. Imputar sin revisar si los faltantes siguen un patrón puede introducir sesgos en el análisis.',
    },
    {
      label: 'Atípicos: ¿error o señal?',
      body: 'En el monitoreo de procesos, un valor atípico puede ser justamente lo que se busca. Wigger et al. (2025) etiquetaron como anomalía todo consumo por fuera de 1,5 veces el rango intercuartílico, y esas anomalías fueron la base para detectar consumo evitable. Uslu y Büyüklü (2024), en cambio, excluyeron valores imposibles para el alcance del negocio.',
    },
  ],
  practices: [
    {
      title: 'Entender el proceso y elegir las variables',
      description: 'Antes de limpiar, se evalúa cada variable por su significado, disponibilidad, faltantes y confiabilidad: de 83 quedaron 30.',
      source: 'Uslu y Büyüklü (2024)',
    },
    {
      title: 'Excluir con reglas del negocio',
      description: 'Transacciones internas, reparaciones que no ocurrieron y costos imposibles para el alcance del negocio quedan fuera del análisis.',
      source: 'Uslu y Büyüklü (2024)',
    },
    {
      title: 'Decidir sobre los faltantes con criterio',
      description: 'Se eliminaron en lugar de imputar porque eran pocos y sin patrón sistemático.',
      source: 'Wigger et al. (2025)',
    },
    {
      title: 'Derivar variables con quien conoce el proceso',
      description: 'Tiempo hasta cotización, día hábil o festivo: todas son variables que no existían y que explican el proceso.',
      source: 'Uslu y Büyüklü (2024); Wigger et al. (2025)',
    },
    {
      title: 'Volver a depurar al analizar',
      description: 'Grupos que se adelantaban en la fila contaminaban las marcas de tiempo. El problema solo apareció al analizar.',
      source: 'Kang y Zhong (2023)',
    },
  ],
  band: {
    label: 'En cualquier paso',
    title: 'Segmentar cuando el proceso no es homogéneo',
    text: 'Días hábiles y fines de semana (Wigger et al., 2025); microempresas y empresas medianas (Marjudi et al., 2023).',
  },
  transcript: 'Llegamos a la parte más importante del recorrido. En el módulo anterior aprendiste a diagnosticar; en este módulo verás qué hacer cuando se tienen datos. Primero se entiende el proceso, luego se excluye con reglas del negocio, se decide con criterio qué hacer con los faltantes y se derivan variables con quien conoce la operación. Y al final viene la práctica no muy utilizada, la cual es volver a depurar, porque muchos problemas aparecen solo al analizar.',
}
