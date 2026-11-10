import { useLayoutEffect, useRef, type KeyboardEvent, type PointerEvent, type RefObject } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import type { AvatarOffset } from '../../state/navigation'
import { clampOffset, type Box } from './petBounds'

const KEY_STEP = 16
const KEY_STEP_LARGE = 48
const MAX_TILT = 14
/** Below this distance (px) a press is a click, not a drag: nothing is saved. */
const DRAG_SLOP = 3

const ARROWS: Record<string, AvatarOffset> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
}

type Drag = { pointerId: number, startX: number, startY: number, from: AvatarOffset, lastX: number, tilt: number }

/**
 * Lets the user pick DataMind up and leave it anywhere inside <main>, like a pet.
 * While dragging, the offset, tilt and "held" pose are written straight to the DOM;
 * the offset is only saved (onChange) when it is dropped. null = back to its place.
 */
export const usePetDrag = ({ wrapperRef, svgRef, saved, onChange }: {
  wrapperRef: RefObject<HTMLDivElement | null>
  svgRef: RefObject<SVGSVGElement | null>
  saved: AvatarOffset | null
  onChange: (offset: AvatarOffset | null) => void
}) => {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const offset = useRef<AvatarOffset>({ x: 0, y: 0 })
  const drag = useRef<Drag | null>(null)

  const boxes = () => {
    const wrapper = wrapperRef.current!
    const rect = wrapper.getBoundingClientRect()
    const { x, y } = offset.current
    const home: Box = { left: rect.left - x, top: rect.top - y, right: rect.right - x, bottom: rect.bottom - y }
    // The avatar layer has exactly the content area's box; <main> is the fallback.
    const main = (wrapper.closest('[data-pet-bounds]') ?? wrapper.closest('main'))?.getBoundingClientRect()
    const bounds: Box = main ?? { left: 0, top: 0, right: innerWidth, bottom: innerHeight }
    return { home, bounds }
  }

  const apply = (next: AvatarOffset, smooth = false) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    offset.current = next
    wrapper.style.transition = smooth && !reducedMotion ? 'transform 260ms ease-out' : ''
    wrapper.style.transform = next.x || next.y ? `translate(${next.x}px, ${next.y}px)` : ''
    wrapper.toggleAttribute('data-moved', Boolean(next.x || next.y))
  }

  const clamped = (next: AvatarOffset) => {
    const { home, bounds } = boxes()
    return clampOffset(next, home, bounds)
  }

  // Saved position of this screen, or its own spot. Either one is then kept inside the
  // visible area: a spot chosen for a tall window can fall below the edge of a short one,
  // and DataMind must always be seen. This waits for the entrance animation to end (while
  // it runs the avatar is still shifted and would be measured wrong) and runs again
  // whenever the window is resized. The correction is not saved.
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const intended = saved ?? { x: 0, y: 0 }
    apply(intended, true)
    const keepInView = () => {
      if (!drag.current) apply(clamped(intended))
    }
    let cancelled = false
    Promise.all(wrapper.getAnimations().map(animation => animation.finished))
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) keepInView()
      })
    addEventListener('resize', keepInView)
    return () => {
      cancelled = true
      removeEventListener('resize', keepInView)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-apply only when the saved offset changes
  }, [saved?.x, saved?.y])

  const setHeld = (held: boolean) => {
    const svg = svgRef.current
    wrapperRef.current?.toggleAttribute('data-dragging', held)
    if (!svg) return
    svg.toggleAttribute('data-held', held)
    svg.style.setProperty('--avatar-held', held ? '1' : '0')
    if (!held) svg.style.setProperty('--pet-tilt', '0deg')
  }

  const bounce = () => {
    if (reducedMotion) return
    svgRef.current?.animate(
      [{ scale: '1' }, { scale: '1.08 0.94' }, { scale: '0.97 1.03' }, { scale: '1' }],
      { duration: 380, easing: 'ease-out' },
    )
  }

  const finish = (commit: boolean) => {
    const current = drag.current
    if (!current) return
    drag.current = null
    const wrapper = wrapperRef.current
    if (wrapper?.hasPointerCapture(current.pointerId)) wrapper.releasePointerCapture(current.pointerId)
    setHeld(false)
    const moved = Math.abs(offset.current.x - current.from.x) + Math.abs(offset.current.y - current.from.y) > DRAG_SLOP
    if (!commit) {
      apply(current.from, true)
      return
    }
    if (!moved) return
    bounce()
    onChange(offset.current)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || drag.current) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, from: offset.current, lastX: event.clientX, tilt: 0 }
    apply(offset.current)
    setHeld(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current
    if (!current || event.pointerId !== current.pointerId) return
    apply(clamped({ x: current.from.x + event.clientX - current.startX, y: current.from.y + event.clientY - current.startY }))
    if (!reducedMotion) {
      // Leans into the movement, like being carried; eases back when the pointer stops.
      const target = Math.max(-MAX_TILT, Math.min((event.clientX - current.lastX) * 1.5, MAX_TILT))
      current.tilt += (target - current.tilt) * 0.3
      svgRef.current?.style.setProperty('--pet-tilt', `${current.tilt.toFixed(1)}deg`)
    }
    current.lastX = event.clientX
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (drag.current) {
      if (event.key === 'Escape') {
        event.preventDefault()
        finish(false)
      }
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      onChange(null)
      return
    }
    const arrow = ARROWS[event.key]
    if (!arrow) return
    event.preventDefault()
    const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP
    const next = clamped({ x: offset.current.x + arrow.x * step, y: offset.current.y + arrow.y * step })
    apply(next, true)
    onChange(next.x || next.y ? next : null)
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: () => finish(true),
    onPointerCancel: () => finish(true),
    onLostPointerCapture: () => finish(true),
    onKeyDown,
    onDoubleClick: () => onChange(null),
  }
}
