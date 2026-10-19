import type { ComponentProps } from 'react'

export type CardProps = ComponentProps<'div'> & {
  as?: 'div' | 'section' | 'article'
}

export const Card = ({ as: Tag = 'div', className = '', ...props }: CardProps) => (
  <Tag
    className={`rounded-card border-[1.5px] border-line bg-surface ${className}`}
    {...props}
  />
)
