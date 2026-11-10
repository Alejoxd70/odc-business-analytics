import type { AvatarOffset } from '../../state/navigation'

export type Box = { left: number, top: number, right: number, bottom: number }

/**
 * Keeps the avatar inside `bounds`: `home` is its box with no offset (its place in the
 * layout), so the offset is limited to what still fits, `margin` px from the edges.
 * If the avatar is bigger than the bounds on an axis, it sticks to the start edge.
 */
export const clampOffset = (offset: AvatarOffset, home: Box, bounds: Box, margin = 4): AvatarOffset => {
  const clampAxis = (value: number, min: number, max: number) => Math.round(Math.max(min, Math.min(value, Math.max(min, max))))
  return {
    x: clampAxis(offset.x, bounds.left + margin - home.left, bounds.right - margin - home.right),
    y: clampAxis(offset.y, bounds.top + margin - home.top, bounds.bottom - margin - home.bottom),
  }
}
