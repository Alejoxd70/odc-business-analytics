export type DataStateId = 1 | 2 | 3 | 4

/** The four data states (module 2). Reused by screens 6, 7 and 10. */
export const dataStates = [
  { id: 1, label: 'Estado 1', name: 'Sin registro' },
  { id: 2, label: 'Estado 2', name: 'Registro no explotable' },
  { id: 3, label: 'Estado 3', name: 'Registro fragmentado' },
  { id: 4, label: 'Estado 4', name: 'Registro analizable' },
] as const satisfies { id: DataStateId, label: string, name: string }[]
