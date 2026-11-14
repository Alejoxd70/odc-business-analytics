import type { ComponentType } from 'react'
import { screen01 } from '../content/screen01'
import { screen02 } from '../content/screen02'
import { screen03 } from '../content/screen03'
import { screen04 } from '../content/screen04'
import { screen05 } from '../content/screen05'
import { screen06 } from '../content/screen06'
import { screen07 } from '../content/screen07'
import { screen08 } from '../content/screen08'
import { screen09 } from '../content/screen09'
import { screen10 } from '../content/screen10'
import { screen11 } from '../content/screen11'
import { screen12 } from '../content/screen12'
import { screen13 } from '../content/screen13'
import { screen14 } from '../content/screen14'
import { TOTAL_SCREENS } from '../state/navigation'
import { Screen01Cover } from './Screen01Cover'
import { Screen02Introduction } from './Screen02Introduction'
import { Screen03Menu } from './Screen03Menu'
import { Screen04Module1 } from './Screen04Module1'
import { Screen05Module1Evidence } from './Screen05Module1Evidence'
import { Screen06Module2States } from './Screen06Module2States'
import { Screen07Module2Classify } from './Screen07Module2Classify'
import { Screen08Module3Practices } from './Screen08Module3Practices'
import { Screen09Module3Evidence } from './Screen09Module3Evidence'
import { Screen10Module3EntryRoutes } from './Screen10Module3EntryRoutes'
import { Screen11Module4Governance } from './Screen11Module4Governance'
import { Screen12Module4Monitoring } from './Screen12Module4Monitoring'
import { Screen13FinalAssessment } from './Screen13FinalAssessment'
import { Screen14Conclusion } from './Screen14Conclusion'
import { Screen15References } from './Screen15References'
import { Screen16Credits } from './Screen16Credits'

/** Bottom bar configuration for each screen. */
export type NavConfig = {
  showPrev: boolean
  showMenu: boolean
  /** On the menu screen itself: "Menú" disabled and marked with aria-current. */
  menuCurrent?: boolean
  next: { label?: string } | null
  hint?: string
}

/**
 * Where DataMind floats on a screen (it is not part of the screen's layout), as literal
 * classes so Tailwind detects them. `place` positions it from 1024 px up, in the screen's
 * free spot; `enter` is its entrance (enter-N…), timed with the screen's own entrance.
 */
export type AvatarPlacement = { place: string, enter: string }

/** Below 1024 px DataMind is small and sits in the bottom-right corner on every screen. */
export const AVATAR_NARROW_PLACE = 'right-6 bottom-3'

export type ScreenEntry = {
  Component: ComponentType
  /** DataMind's script, used as the audio transcript. */
  transcript?: string
  nav?: Partial<NavConfig>
  avatar?: AvatarPlacement
}

/** The 16 screens of the ODC, by number. */
export const screenEntries: Partial<Record<number, ScreenEntry>> = {
  1: {
    Component: Screen01Cover,
    avatar: {
      place: 'lg:left-[584px] lg:right-auto lg:top-[8px] lg:bottom-auto xl:left-auto xl:right-[24px] xl:top-[8px] xl:bottom-auto 2xl:left-[16px] 2xl:right-auto 2xl:top-auto 2xl:bottom-[8px]',
      enter: 'enter-6 enter-pop',
    },
    transcript: screen01.transcript,
    nav: { showPrev: false, showMenu: false, next: null, hint: screen01.hint },
  },
  2: {
    Component: Screen02Introduction,
    avatar: {
      place: 'lg:left-auto lg:right-[408px] lg:top-auto lg:bottom-[8px] xl:left-auto xl:right-[24px] xl:top-auto xl:bottom-[8px] 2xl:left-[16px] 2xl:right-auto 2xl:top-auto 2xl:bottom-[8px]',
      enter: 'enter-5 enter-rise',
    },
    transcript: screen02.transcript,
  },
  3: {
    Component: Screen03Menu,
    avatar: {
      place: 'lg:left-[16px] lg:right-auto lg:top-auto lg:bottom-[8px] xl:left-[16px] xl:right-auto xl:top-auto xl:bottom-[8px] 2xl:left-[calc((100%-90rem)/2+5rem)] 2xl:right-auto 2xl:top-auto 2xl:bottom-[8px]',
      enter: 'enter-3 enter-from-start',
    },
    transcript: screen03.transcript,
    nav: { menuCurrent: true },
  },
  4: {
    Component: Screen04Module1,
    avatar: {
      place: 'lg:left-auto lg:right-[24px] lg:top-[144px] lg:bottom-auto xl:left-[560px] xl:right-auto xl:top-auto xl:bottom-[8px] 2xl:left-[488px] 2xl:right-auto 2xl:top-auto 2xl:bottom-[8px]',
      enter: 'enter-3 enter-rise',
    },
    transcript: screen04.transcript,
  },
  5: {
    Component: Screen05Module1Evidence,
    avatar: {
      place: 'lg:left-[672px] lg:right-auto lg:top-[8px] lg:bottom-auto xl:left-[16px] xl:right-auto xl:top-auto xl:bottom-[8px] 2xl:left-auto 2xl:right-[24px] 2xl:top-auto 2xl:bottom-[8px]',
      enter: 'enter-9 enter-rise',
    },
    transcript: screen05.transcript,
  },
  6: {
    Component: Screen06Module2States,
    avatar: {
      place: 'lg:left-auto lg:right-[24px] lg:top-[8px] lg:bottom-auto xl:left-auto xl:right-[24px] xl:top-[8px] xl:bottom-auto 2xl:left-auto 2xl:right-[24px] 2xl:top-[8px] 2xl:bottom-auto',
      enter: 'enter-3 enter-from-end',
    },
    transcript: screen06.transcript,
  },
  7: {
    Component: Screen07Module2Classify,
    avatar: {
      place: 'lg:left-auto lg:right-[120px] lg:top-auto lg:bottom-[8px] xl:left-auto xl:right-[168px] xl:top-auto xl:bottom-[8px] 2xl:left-auto 2xl:right-[168px] 2xl:top-auto 2xl:bottom-[8px]',
      enter: 'enter-8 enter-grow',
    },
    transcript: screen07.transcript,
  },
  8: {
    Component: Screen08Module3Practices,
    avatar: {
      place: 'lg:left-auto lg:right-[24px] lg:top-[176px] lg:bottom-auto xl:left-auto xl:right-[24px] xl:top-[136px] xl:bottom-auto 2xl:left-auto 2xl:right-[24px] 2xl:top-[128px] 2xl:bottom-auto',
      enter: 'enter-3 enter-from-end',
    },
    transcript: screen08.transcript,
  },
  9: {
    Component: Screen09Module3Evidence,
    avatar: {
      place: 'lg:left-auto lg:right-[24px] lg:top-[168px] lg:bottom-auto xl:left-auto xl:right-[24px] xl:top-auto xl:bottom-[8px] 2xl:left-[760px] 2xl:right-auto 2xl:top-auto 2xl:bottom-[8px]',
      enter: 'enter-3 enter-pop',
    },
    transcript: screen09.transcript,
  },
  10: {
    Component: Screen10Module3EntryRoutes,
    avatar: {
      place: 'lg:left-[488px] lg:right-auto lg:top-[344px] lg:bottom-auto xl:left-auto xl:right-[24px] xl:top-[8px] xl:bottom-auto 2xl:left-[16px] 2xl:right-auto 2xl:top-auto 2xl:bottom-[8px]',
      enter: 'enter-3 enter-rise',
    },
    transcript: screen10.transcript,
  },
  11: {
    Component: Screen11Module4Governance,
    avatar: {
      place: 'lg:left-auto lg:right-[24px] lg:top-[8px] lg:bottom-auto xl:left-auto xl:right-[24px] xl:top-[152px] xl:bottom-auto 2xl:left-auto 2xl:right-[24px] 2xl:top-[8px] 2xl:bottom-auto',
      enter: 'enter-2 enter-from-end',
    },
    transcript: screen11.transcript,
  },
  12: {
    Component: Screen12Module4Monitoring,
    avatar: {
      place: 'lg:left-auto lg:right-[24px] lg:top-[360px] lg:bottom-auto xl:left-auto xl:right-[12px] xl:top-[8px] xl:bottom-auto 2xl:left-auto 2xl:right-[24px] 2xl:top-auto 2xl:bottom-[216px]',
      enter: 'enter-3 enter-pop',
    },
    transcript: screen12.transcript,
  },
  13: {
    Component: Screen13FinalAssessment,
    avatar: {
      place: 'lg:left-[392px] lg:right-auto lg:top-[376px] lg:bottom-auto xl:left-[504px] xl:right-auto xl:top-auto xl:bottom-[8px] 2xl:left-[504px] 2xl:right-auto 2xl:top-auto 2xl:bottom-[8px]',
      enter: 'enter-7 enter-pop',
    },
    transcript: screen13.transcript,
  },
  14: {
    Component: Screen14Conclusion,
    avatar: {
      place: 'lg:left-auto lg:right-[24px] lg:top-[8px] lg:bottom-auto xl:left-auto xl:right-[24px] xl:top-[8px] xl:bottom-auto 2xl:left-auto 2xl:right-[24px] 2xl:top-[8px] 2xl:bottom-auto',
      enter: 'enter-2 enter-from-end',
    },
    transcript: screen14.transcript,
  },
  15: {
    Component: Screen15References,
  },
  16: {
    Component: Screen16Credits,
  },
}

export const getNavConfig = (n: number): NavConfig => ({
  showPrev: n > 1,
  showMenu: true,
  next: n < TOTAL_SCREENS ? {} : null,
  ...screenEntries[n]?.nav,
})
