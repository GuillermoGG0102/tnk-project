'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: 'primary' | 'accent' | 'none'
  as?: 'div' | 'article' | 'section'
}

export function Card({ children, className, hover = true, glow = 'none', as: Tag = 'div' }: CardProps) {
  const glowClass = {
    primary: 'hover:shadow-[0_0_40px_rgba(0,207,255,0.1)] hover:border-[#00CFFF]/20',
    accent:  'hover:shadow-[0_0_40px_rgba(0,255,179,0.1)] hover:border-[#00FFB3]/20',
    none:    '',
  }[glow]

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
        className={cn('surface-card transition-[border-color,box-shadow] duration-300', glowClass, className)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <Tag className={cn('surface-card', className)}>
      {children}
    </Tag>
  )
}

interface CardHeaderProps { children: React.ReactNode; className?: string }
export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn('p-6 pb-4', className)}>{children}</div>
}

interface CardBodyProps { children: React.ReactNode; className?: string }
export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn('px-6 pb-6', className)}>{children}</div>
}

interface CardFooterProps { children: React.ReactNode; className?: string }
export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-white/5', className)}>
      {children}
    </div>
  )
}
