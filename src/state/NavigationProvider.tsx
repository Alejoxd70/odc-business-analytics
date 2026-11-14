import { useReducer, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { initialNavState, NavigationContext, navigationReducer, type ActivityState, type AvatarOffset, type NavAction, type NavState } from './navigation'

export const NavigationProvider = ({ initialState = initialNavState, children }: {
  initialState?: NavState
  children: ReactNode
}) => {
  const [state, dispatch] = useReducer(navigationReducer, initialState)

  // Changing screen: the outgoing content fades out (View Transitions API, styled in
  // index.css) while the new one plays its own entrance. Without the API, or with reduced
  // motion, the change is immediate.
  const navigate = (action: NavAction) => {
    const supported = typeof document.startViewTransition === 'function'
    if (!supported || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dispatch(action)
      return
    }
    document.startViewTransition(() => flushSync(() => dispatch(action)))
  }

  const value = {
    state,
    goTo: (screen: number) => navigate({ type: 'goTo', screen }),
    next: () => navigate({ type: 'next' }),
    prev: () => navigate({ type: 'prev' }),
    goToMenu: () => navigate({ type: 'goToMenu' }),
    setActivity: (id: string, activity: ActivityState) => dispatch({ type: 'setActivity', id, state: activity }),
    setAvatarOffset: (screen: number, offset: AvatarOffset | null) => dispatch({ type: 'setAvatarOffset', screen, offset }),
    markAudioHeard: (screen: number) => dispatch({ type: 'markAudioHeard', screen }),
    markAvatarHintSeen: () => dispatch({ type: 'markAvatarHintSeen' }),
  }
  return <NavigationContext value={value}>{children}</NavigationContext>
}
