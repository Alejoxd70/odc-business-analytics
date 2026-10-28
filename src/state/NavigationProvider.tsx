import { useReducer, type ReactNode } from 'react'
import { initialNavState, NavigationContext, navigationReducer, type ActivityState, type NavState } from './navigation'

export const NavigationProvider = ({ initialState = initialNavState, children }: {
  initialState?: NavState
  children: ReactNode
}) => {
  const [state, dispatch] = useReducer(navigationReducer, initialState)
  const value = {
    state,
    goTo: (screen: number) => dispatch({ type: 'goTo', screen }),
    next: () => dispatch({ type: 'next' }),
    prev: () => dispatch({ type: 'prev' }),
    goToMenu: () => dispatch({ type: 'goToMenu' }),
    setActivity: (id: string, activity: ActivityState) => dispatch({ type: 'setActivity', id, state: activity }),
  }
  return <NavigationContext value={value}>{children}</NavigationContext>
}
