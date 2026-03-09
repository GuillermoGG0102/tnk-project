'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { analytics } from '@/lib/analytics'

const NAV_LINKS = [
  { href: '/',         label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog',     label: 'Blog' },
  { href: '/contact',  label: 'Contact' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled]   = useState(false)
  const [isMobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted]          = useState(false)
  const { theme, setTheme }            = useTheme()
  const pathname                       = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    analytics.themeToggle(next)
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-[background-color,backdrop-filter,border-color] duration-300',
          isScrolled
            ? 'bg-[#0A0F1E]/90 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent',
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group focus-ring"
              onClick={() => analytics.navClick('Logo', '/')}
            >
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00CFFF] to-[#00FFB3] rounded-lg opacity-20 group-hover:opacity-40 transition-opacity duration-200" />
                <div className="relative flex items-center justify-center w-full h-full">
                  <span className="font-display font-bold text-lg text-[#00CFFF] tracking-tight">T</span>
                  <span className="font-display font-bold text-lg text-[#00FFB3] tracking-tight">NK</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-semibold text-[#F0F4FF] text-sm tracking-tight">TNK</span>
                <span className="text-[#4D5E87] text-xs block leading-none">Design & Analytics</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => analytics.navClick(label, href)}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium rounded-lg',
                      'transition-[color,background-color] duration-200',
                      'focus-ring',
                      isActive
                        ? 'text-[#F0F4FF] bg-white/5'
                        : 'text-[#8A9CC8] hover:text-[#F0F4FF] hover:bg-white/5',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00CFFF]"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    {label}
                  </Link>
                )
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className={cn(
                    'p-2 rounded-lg text-[#8A9CC8]',
                    'hover:text-[#F0F4FF] hover:bg-white/5',
                    'transition-[color,background-color] duration-200',
                    'focus-ring',
                  )}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}

              {/* CTA */}
              <Link
                href="/contact"
                className={cn(
                  'hidden md:inline-flex items-center gap-1.5',
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  'bg-[#00CFFF]/10 text-[#00CFFF] border border-[#00CFFF]/20',
                  'hover:bg-[#00CFFF]/20 hover:border-[#00CFFF]/40',
                  'transition-[background-color,border-color] duration-200',
                  'focus-ring',
                )}
                onClick={() => analytics.navClick('Get in Touch', '/contact')}
              >
                Get in touch
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileOpen}
                className={cn(
                  'md:hidden p-2 rounded-lg text-[#8A9CC8]',
                  'hover:text-[#F0F4FF] hover:bg-white/5',
                  'transition-[color,background-color] duration-200',
                  'focus-ring',
                )}
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#0F1629] border-l border-white/[0.06] md:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <span className="font-display font-bold text-[#F0F4FF]">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-[#8A9CC8] hover:text-[#F0F4FF] hover:bg-white/5 transition-[color,background-color] duration-200 focus-ring"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="p-4 flex flex-col gap-1">
                {NAV_LINKS.map(({ href, label }) => {
                  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'px-4 py-3 rounded-lg text-sm font-medium',
                        'transition-[color,background-color] duration-200',
                        'focus-ring',
                        isActive
                          ? 'text-[#F0F4FF] bg-white/8'
                          : 'text-[#8A9CC8] hover:text-[#F0F4FF] hover:bg-white/5',
                      )}
                    >
                      {label}
                    </Link>
                  )
                })}
              </nav>

              <div className="absolute bottom-8 left-0 right-0 px-4">
                <Link
                  href="/contact"
                  className={cn(
                    'block w-full text-center px-4 py-3 rounded-lg text-sm font-semibold',
                    'bg-[#00CFFF] text-[#0A0F1E]',
                    'hover:bg-[#1AD5FF] active:scale-[0.97]',
                    'transition-[background-color,transform] duration-200',
                    'focus-ring',
                  )}
                >
                  Get in touch
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
