'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { analytics } from '@/lib/analytics'
import { BLOG_CATEGORIES } from '@/types'
import type { BlogCategory } from '@/types'
import { cn } from '@/lib/utils'

const ALL_OPTION = { value: 'all', label: 'All' }

export function CategoryFilter() {
  const router      = useRouter()
  const searchParams = useSearchParams()
  const active       = (searchParams.get('category') ?? 'all') as BlogCategory | 'all'

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('category')
    } else {
      params.set('category', value)
    }
    params.delete('page')
    router.push(`?${params.toString()}`, { scroll: false })
    analytics.filterChange('blog_category', value)
  }

  const options = [
    ALL_OPTION,
    ...Object.entries(BLOG_CATEGORIES).map(([value, { label }]) => ({ value, label })),
  ]

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {options.map(({ value, label }) => {
        const isActive = active === value
        const color = value !== 'all' ? BLOG_CATEGORIES[value as BlogCategory]?.color : undefined

        return (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            aria-pressed={isActive}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium',
              'transition-[background-color,color,border-color] duration-200',
              'border focus-ring',
              isActive
                ? 'bg-[#00CFFF]/15 text-[#00CFFF] border-[#00CFFF]/30'
                : 'bg-transparent text-[#8A9CC8] border-white/10 hover:border-white/20 hover:text-[#F0F4FF]',
            )}
            style={isActive && color ? { backgroundColor: `${color}15`, color, borderColor: `${color}30` } : undefined}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
