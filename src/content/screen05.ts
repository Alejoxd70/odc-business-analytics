import type { TrueFalseItem } from '../activities/TrueFalseActivity'

export const screen05 = {
  title: 'No es un problema que pasa solo en Colombia',
  evidence: [
    {
      figure: '3,5 %',
      text: 'de las empresas manufactureras italianas invirtió en analítica de big data, pese a los incentivos públicos.',
      source: 'Basile et al. (2024)',
    },
    {
      figure: '0 de 240',
      text: 'empresas medianas y grandes con unidad de BI tenía un marco de gobierno de datos implementado.',
      source: 'Jankovic y Curovic (2023)',
    },
    {
      figure: '34 estudios',
      text: 'revisados sobre MIPYMES manufactureras indicaron que el problema más sobresaliente es la limitación de los datos.',
      source: 'De Simone et al. (2023)',
    },
  ],
  activity: {
    title: 'Actividad (verdadero o falso)',
    items: [
      {
        statement: 'Si una empresa ya tiene un ERP (planificación de recursos empresariales) o una unidad de BI, sus datos están listos para analizar.',
        answer: 'false',
        feedback: 'Tener el sistema adecuado no garantiza datos gestionados: ninguna de 240 empresas medianas y grandes con unidad de BI tenía gobierno de datos implementado (Jankovic y Curovic, 2023).',
      },
      {
        statement: 'Los incentivos públicos para comprar tecnología resuelven la adopción de analítica.',
        answer: 'false',
        feedback: 'En Italia, con incentivos del Plan Nacional Empresa 4.0, solo el 3,5 % de las empresas manufactureras invirtió en analítica de big data (Basile et al., 2024).',
      },
      {
        statement: 'Los problemas de datos son la limitación más reportada para usar IA y analítica en MIPYMES manufactureras.',
        answer: 'true',
        feedback: 'Una revisión de 34 estudios encontró que la calidad, cantidad y disponibilidad de datos son la limitación más señalada, y que las empresas deben estructurar la recolección antes de cualquier solución más compleja (De Simone et al., 2023).',
      },
    ] satisfies TrueFalseItem[],
  },
  transcript: 'La falta de datos no es un asunto exclusivo de los micronegocios colombianos. Las siguientes evidencias lo demuestran. Lee los casos que pasan en diversos países y analízalos. En la actividad, marca si cada afirmación es verdadera o falsa. Después de responder, lee la retroalimentación; allí encontrarás la evidencia que la respalda.',
}
