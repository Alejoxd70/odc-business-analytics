import type { ComponentProps } from 'react'
import type { LucideIcon } from 'lucide-react'

export type ButtonVariant = 'primary' | 'secondary' | 'on-dark'
export type ButtonSize = 'md' | 'sm'

export type ButtonProps = Omit<ComponentProps<'button'>, 'type'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  iconLeft?: LucideIcon
  iconRight?: LucideIcon
}

const base
  = 'inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-[1.5px] font-medium whitespace-nowrap transition-[color,background-color,border-color] '
    + 'disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  'primary': 'border-transparent bg-data text-white hover:enabled:bg-data-deep',
  'secondary': 'border-ink bg-transparent text-ink hover:enabled:bg-surface',
  'on-dark': 'border-white bg-transparent text-white hover:enabled:bg-white/10',
}

const sizes: Record<ButtonSize, { button: string, icon: number }> = {
  md: { button: 'h-[50px] px-6 text-[17px]', icon: 20 },
  sm: { button: 'h-11 px-5 text-small', icon: 18 },
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  iconLeft: IconLeft,
  iconRight: IconRight,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const { button, icon } = sizes[size]
  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${button} ${className}`}
      {...props}
    >
      {IconLeft && <IconLeft size={icon} aria-hidden="true" />}
      {children}
      {IconRight && <IconRight size={icon} aria-hidden="true" />}
    </button>
  )
}
