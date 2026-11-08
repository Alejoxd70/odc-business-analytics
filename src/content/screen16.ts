export type MetaField = {
  label: string
  /** Empty value: the field is not rendered. */
  value: string
  /** Part of the value that links to an external site. */
  link?: { text: string, href: string }
}

export const screen16 = {
  title: 'Créditos',
  metadata: {
    title: 'Metadatos',
    fields: [
      { label: 'Área de conocimiento', value: 'Business Analytics' },
      { label: 'Nombre del material', value: 'Del registro al análisis de datos para Business Analytics en MIPYMES' },
      { label: 'Autor', value: 'Sebastián Alejandro Castañeda Beltrán' },
      { label: 'Diseño y desarrollo', value: 'Sebastián Alejandro Castañeda Beltrán' },
      { label: 'Imágenes', value: 'Elaboración propia' },
      { label: 'Avatar', value: 'DataMind, creado con DiceBear', link: { text: 'DiceBear', href: 'https://www.dicebear.com' } },
      { label: 'Sonidos y voces', value: 'Voz de DataMind generada con Luvvoice', link: { text: 'Luvvoice', href: 'https://luvvoice.com' } },
      { label: 'Fecha de creación', value: '1/10/2026' },
      { label: 'Nivel educativo', value: 'Intermedio' },
    ] as MetaField[],
  },
  license: {
    badgeAlt: 'Licencia Creative Commons Atribución 4.0 Internacional',
    badgeText: 'CC BY 4.0',
    attribution: '“Del registro al análisis de datos para Business Analytics en MIPYMES”, por Sebastián Alejandro Castañeda Beltrán, Universidad de Cundinamarca, se distribuye bajo una licencia Creative Commons Atribución 4.0 Internacional (CC BY 4.0).',
    linkText: 'Ver la licencia',
    href: 'https://creativecommons.org/licenses/by/4.0/deed.es',
  },
}
