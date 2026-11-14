import { dataStates } from './states'

/**
 * Key terms of each screen, by screen number. DataMind shows them one at a time in the
 * small bubble next to it. Keep them short: each one must fit on a single line.
 */
export const keywords: Partial<Record<number, string[]>> = {
  1: ['Del registro al análisis', 'MIPYMES', 'Los datos primero'],
  2: ['Resultado de aprendizaje', 'Diagnosticar', 'Monitorear procesos'],
  3: ['Tu recorrido', 'Cuatro módulos', 'Evaluación final'],
  4: ['Business Analytics', 'Micronegocios', 'Registro de cuentas'],
  5: ['Evidencia', 'Falta de datos', 'Otros países'],
  6: dataStates.map(state => state.name),
  7: ['Diagnosticar', 'Estado del dato', 'Cuatro empresas'],
  8: ['Entender el proceso', 'Reglas del negocio', 'Datos faltantes', 'Derivar variables', 'Volver a depurar'],
  9: ['Preparación', 'Transformación', 'Secuencia correcta'],
  10: ['Rutas de entrada', 'Plantilla', 'Hoja de cálculo', 'Despliegue por partes'],
  11: ['Gobierno de datos', 'Reglas', 'Responsables', 'Estándares'],
  12: ['Monitoreo', 'Anomalías', 'Tablero confiable'],
  13: ['Crucigrama', 'Seis casos', 'Cinco palabras'],
  14: ['El dato va primero', 'Diagnosticar', 'Preparación', 'Gobierno de datos'],
}
