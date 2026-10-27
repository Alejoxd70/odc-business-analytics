import type { ComponentType } from 'react'
import { pantalla01 } from '../content/pantalla01'
import { pantalla02 } from '../content/pantalla02'
import { pantalla03 } from '../content/pantalla03'
import { TOTAL_SCREENS } from '../state/navigation'
import { Pantalla01Portada } from './Pantalla01Portada'
import { Pantalla02PrimeraEntrada } from './Pantalla02PrimeraEntrada'
import { Pantalla03Menu } from './Pantalla03Menu'

/** Configuración de la barra inferior para cada pantalla. */
export type NavConfig = {
  showPrev: boolean
  showMenu: boolean
  /** En la propia pantalla del menú: «Menú» deshabilitado y con aria-current. */
  menuCurrent?: boolean
  next: { label?: string } | null
  hint?: string
}

export type ScreenEntry = {
  Component: ComponentType
  /** Guion de DataMind para la transcripción del audio. */
  transcript?: string
  nav?: Partial<NavConfig>
}

/** Pantallas ya construidas. Las demás se muestran como PantallaPendiente. */
export const screenEntries: Partial<Record<number, ScreenEntry>> = {
  1: {
    Component: Pantalla01Portada,
    transcript: pantalla01.transcript,
    nav: { showPrev: false, showMenu: false, next: null, hint: pantalla01.hint },
  },
  2: {
    Component: Pantalla02PrimeraEntrada,
    transcript: pantalla02.transcript,
  },
  3: {
    Component: Pantalla03Menu,
    transcript: pantalla03.transcript,
    nav: { menuCurrent: true },
  },
}

export const getNavConfig = (n: number): NavConfig => ({
  showPrev: n > 1,
  showMenu: true,
  next: n < TOTAL_SCREENS ? {} : null,
  ...screenEntries[n]?.nav,
})
