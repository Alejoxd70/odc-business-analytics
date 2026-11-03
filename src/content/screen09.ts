import type { SequenceStep } from '../activities/SequenceActivity'
import type { HBarItem } from '../components/charts/HBarChart'

export const screen09 = {
  title: '¿La preparación cambia el resultado?',
  skewness: {
    label: 'Caso 1, 353 microempresas',
    title: 'La transformación estándar casi no cambió nada',
    chartTitle: 'Asimetría de la variable a modelar',
    max: 18,
    bars: [
      { label: 'Datos originales', value: 17.21 },
      { label: 'Con transformación logarítmica', value: 16.57 },
      { label: 'Separando microempresas', value: 10.21, highlighted: true },
    ] satisfies HBarItem[],
    source: 'Marjudi et al. (2023)',
  },
  grouping: {
    label: 'Caso 2, mantenimiento aeronáutico',
    title: 'Agrupar con criterio de negocio superó a estandarizar',
    standardized: { label: 'Variables estandarizadas', text: 'Error que los propios autores juzgaron muy alto' },
    grouped: { label: 'Variables agrupadas', text: 'Modelo útil para explicar el margen, con Gini de 0,821' },
    source: 'Uslu y Büyüklü (2024)',
  },
  activity: {
    title: 'Actividad: ordena la preparación',
    instruction: 'Un taller de costura exportó seis meses de su hoja de cálculo para monitorear defectos por lote. Arrastra los pasos hasta formar la secuencia correcta.',
    steps: [
      {
        id: 'understand',
        text: 'Entender el proceso y elegir las variables',
        feedback: 'Va primero porque las reglas de exclusión dependen de saber qué es imposible en ese negocio. Uslu y Büyüklü (2024) evaluaron cada una de 83 variables antes de limpiar.',
      },
      {
        id: 'exclude',
        text: 'Excluir registros imposibles con reglas del negocio',
        feedback: 'Solo después de entender el proceso puedes definir qué es imposible; por ejemplo, un lote con más unidades defectuosas que producidas.',
      },
      {
        id: 'missing',
        text: 'Decidir con criterio si imputar o eliminar faltantes',
        feedback: 'Se decide sobre datos ya depurados, ya que, si imputas antes de excluir, rellenarías los huecos con información no valiosa.',
      },
      {
        id: 'derive',
        text: 'Derivar variables con quien conoce el proceso',
        feedback: 'Se construyen sobre datos limpios: una tasa de defectos por lote calculada con registros imposibles sería engañosa.',
      },
      {
        id: 'recheck',
        text: 'Volver a depurar al analizar',
        feedback: 'No es opcional, ya que, en el caso de Kang y Zhong (2023), los lotes que se adelantaban en la fila solo se detectaron al analizar los tiempos.',
      },
    ] satisfies SequenceStep[],
    // Fixed bank order: steps 5, 3, 1, 4, 2.
    initialOrder: ['recheck', 'missing', 'understand', 'derive', 'exclude'],
    reviewFeedback: 'Este paso no va aquí. Pregúntate qué necesitas tener resuelto antes de seguir.',
  },
  transcript: '¿De verdad importa cómo se preparan los datos? Mira estos dos casos. En el primero, una transformación estándar casi no cambió la forma de los datos. En el segundo, con el mismo algoritmo, los autores consideraron muy alto el error cuando solo estandarizaron las variables. En la actividad tienes los pasos de preparación desordenados; tu tarea es arrastrarlos hasta formar la secuencia correcta para el taller de costura.',
}
