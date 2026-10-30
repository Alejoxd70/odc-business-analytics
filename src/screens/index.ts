import type { ComponentType } from 'react'
import { screen01 } from '../content/screen01'
import { screen02 } from '../content/screen02'
import { screen03 } from '../content/screen03'
import { screen04 } from '../content/screen04'
import { screen05 } from '../content/screen05'
import { screen06 } from '../content/screen06'
import { screen07 } from '../content/screen07'
import { TOTAL_SCREENS } from '../state/navigation'
import { Screen01Cover } from './Screen01Cover'
import { Screen02Introduction } from './Screen02Introduction'
import { Screen03Menu } from './Screen03Menu'
import { Screen04Module1 } from './Screen04Module1'
import { Screen05Module1Evidence } from './Screen05Module1Evidence'
import { Screen06Module2States } from './Screen06Module2States'
import { Screen07Module2Classify } from './Screen07Module2Classify'

/** Bottom bar configuration for each screen. */
export type NavConfig = {
  showPrev: boolean
  showMenu: boolean
  /** On the menu screen itself: "Menú" disabled and marked with aria-current. */
  menuCurrent?: boolean
  next: { label?: string } | null
  hint?: string
}

export type ScreenEntry = {
  Component: ComponentType
  /** DataMind's script, used as the audio transcript. */
  transcript?: string
  nav?: Partial<NavConfig>
}

/** Screens already built. The rest render as PendingScreen. */
export const screenEntries: Partial<Record<number, ScreenEntry>> = {
  1: {
    Component: Screen01Cover,
    transcript: screen01.transcript,
    nav: { showPrev: false, showMenu: false, next: null, hint: screen01.hint },
  },
  2: {
    Component: Screen02Introduction,
    transcript: screen02.transcript,
  },
  3: {
    Component: Screen03Menu,
    transcript: screen03.transcript,
    nav: { menuCurrent: true },
  },
  4: {
    Component: Screen04Module1,
    transcript: screen04.transcript,
  },
  5: {
    Component: Screen05Module1Evidence,
    transcript: screen05.transcript,
  },
  6: {
    Component: Screen06Module2States,
    transcript: screen06.transcript,
  },
  7: {
    Component: Screen07Module2Classify,
    transcript: screen07.transcript,
  },
}

export const getNavConfig = (n: number): NavConfig => ({
  showPrev: n > 1,
  showMenu: true,
  next: n < TOTAL_SCREENS ? {} : null,
  ...screenEntries[n]?.nav,
})
