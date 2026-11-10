/**
 * The avatar canvas is larger than the original 180 × 180 head so the body, the arms,
 * the bulb's halo and the thought cloud fit: the head itself keeps its coordinates.
 */
export const AVATAR_VIEWBOX = { x: -4, y: -8, width: 200, height: 240 }

/** Canvas size relative to the robot: callers scale width/height by it to keep the head size. */
export const AVATAR_SCALE = { x: AVATAR_VIEWBOX.width / 180, y: AVATAR_VIEWBOX.height / 180 }
