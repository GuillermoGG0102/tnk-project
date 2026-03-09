'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { analytics } from '@/lib/analytics'
import { PROJECT_CATEGORIES } from '@/types'
import type { ProjectCategory } from '@/types'

export function ProjectFilter() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const active       = (searchParams.get('category') ?? 'all') as ProjectCategory | 'all'

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('category')
    } else {
      params.set('category', value)
    }
    router.push(`?${params.toString()}`, { scroll: false })
    analytics.filterChange('project_category', value)
  }

  const options = [
    { value: 'all',  label: 'All Work', color: '#00CFFF' },
    ...Object.entries(PROJECT_CATEGORIES).map(([value, { label, color }]) => ({ value, label, color })),
  ]

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by project type">
      {options.map(({ value, label, color }) => {
        const isActive = active === value
        return (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            aria-pressed={isActive}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium',
              'transition-[background-color,color,border-color,box-shadow] duration-200',
              'border focus-ring',
              isActive
                ? 'text-[#0A0F1E] font-semibold border-transparent'
                : 'bg-transparent text-[#8A9CC8] border-white/10 hover:border-white/20 hover:text-[#F0F4FF]',
            )}
            style={
              isActive
                ? { background: color, boxShadow: `0 0 20px ${color}40` }
                : undefined
            }
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
