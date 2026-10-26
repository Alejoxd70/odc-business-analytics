import type { ComponentProps } from 'react'

export type CardTone = 'surface' | 'soft'

export type CardProps = ComponentProps<'div'> & {
  as?: 'div' | 'section' | 'article'
  tone?: CardTone
}

const tones: Record<CardTone, string> = {
  surface: 'border-line bg-surface',
  soft: 'border-state-3 bg-data-soft',
}

export const Card = ({ as: Tag = 'div', tone = 'surface', className = '', ...props }: CardProps) => (
  <Tag
    className={`rounded-card border-[1.5px] ${tones[tone]} ${className}`}
    {...props}
  />
)
