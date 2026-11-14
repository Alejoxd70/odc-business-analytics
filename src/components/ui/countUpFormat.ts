export type FigureParts = {
  prefix: string
  /** The first number of the text. */
  value: number
  /** Decimals it is written with, so every step keeps the same shape. */
  decimals: number
  suffix: string
}

/**
 * Splits a figure written for reading ("≈ 3%", "50,4%", "34 estudios") around its first
 * number, which uses a decimal comma. null when the text has no number.
 */
export const splitFigure = (text: string): FigureParts | null => {
  const match = /\d+(?:,(\d+))?/.exec(text)
  if (!match) return null
  return {
    prefix: text.slice(0, match.index),
    value: Number(match[0].replace(',', '.')),
    decimals: match[1]?.length ?? 0,
    suffix: text.slice(match.index + match[0].length),
  }
}

/** Delay (ms) of an entrance class such as "enter-4": each step adds 70 ms (index.css). */
export const enterDelay = (enterClass: string) => Number(/enter-(\d+)/.exec(enterClass)?.[1] ?? 0) * 70

/** The figure at `progress` (0 to 1) of its way up; at 1 it is the original text. */
export const figureAt = ({ prefix, value, decimals, suffix }: FigureParts, progress: number) =>
  `${prefix}${(value * Math.min(Math.max(progress, 0), 1)).toFixed(decimals).replace('.', ',')}${suffix}`
