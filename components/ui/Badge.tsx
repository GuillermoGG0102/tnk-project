import { cn } from '@/lib/utils'

type BadgeVariant = 'primary' | 'accent' | 'neutral' | 'lol' | 'padel'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-[#00CFFF]/10 text-[#00CFFF] border-[#00CFFF]/20',
  accent:  'bg-[#00FFB3]/10 text-[#00FFB3] border-[#00FFB3]/20',
  neutral: 'bg-white/5 text-[#8A9CC8] border-white/10',
  lol:     'bg-[#C89B3C]/10 text-[#C89B3C] border-[#C89B3C]/20',
  padel:   'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/20',
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        'px-2.5 py-0.5',
        'text-xs font-medium tracking-wide',
        'border rounded-full',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
