import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'accent'
type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  ButtonVariant
  size?:     ButtonSize
  isLoading?: boolean
  asChild?:  boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-[#00CFFF] text-[#0A0F1E] font-semibold',
    'hover:bg-[#1AD5FF] active:bg-[#00AECF]',
    'shadow-[0_0_20px_rgba(0,207,255,0.25)]',
    'hover:shadow-[0_0_28px_rgba(0,207,255,0.4)]',
    'focus-visible:ring-2 focus-visible:ring-[#00CFFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]',
  ].join(' '),

  accent: [
    'bg-[#00FFB3] text-[#0A0F1E] font-semibold',
    'hover:bg-[#1AFFBD] active:bg-[#00CC8F]',
    'shadow-[0_0_20px_rgba(0,255,179,0.25)]',
    'hover:shadow-[0_0_28px_rgba(0,255,179,0.4)]',
    'focus-visible:ring-2 focus-visible:ring-[#00FFB3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]',
  ].join(' '),

  secondary: [
    'bg-[#162038] text-[#F0F4FF] font-medium',
    'border border-white/10',
    'hover:bg-[#1C2A4A] hover:border-white/20 active:bg-[#162038]',
    'focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]',
  ].join(' '),

  outline: [
    'bg-transparent text-[#00CFFF] font-medium',
    'border border-[#00CFFF]/40',
    'hover:bg-[#00CFFF]/10 hover:border-[#00CFFF]/80 active:bg-[#00CFFF]/20',
    'focus-visible:ring-2 focus-visible:ring-[#00CFFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]',
  ].join(' '),

  ghost: [
    'bg-transparent text-[#8A9CC8] font-medium',
    'hover:bg-white/5 hover:text-[#F0F4FF] active:bg-white/10',
    'focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]',
  ].join(' '),
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-md',
  md: 'px-6 py-2.5 text-sm rounded-lg',
  lg: 'px-8 py-3.5 text-base rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'transition-[background-color,box-shadow,transform,opacity] duration-200 ease-out',
          'active:scale-[0.97]',
          'disabled:opacity-50 disabled:pointer-events-none',
          'outline-none',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span>Loading…</span>
          </>
        ) : children}
      </button>
    )
  }
)

Button.displayName = 'Button'
