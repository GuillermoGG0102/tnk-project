import Link from 'next/link'
import { Linkedin, Instagram, Github, Mail, ArrowUpRight } from 'lucide-react'
import { analytics } from '@/lib/analytics'

const SOCIAL_LINKS = [
  {
    href:     'https://www.linkedin.com/in/guillermo-garc%C3%ADa-gonz%C3%A1lez-l%C3%B3pez/',
    label:    'LinkedIn',
    Icon:     Linkedin,
    platform: 'linkedin',
  },
  {
    href:     'https://www.instagram.com/tnkdesigns_/',
    label:    'Instagram',
    Icon:     Instagram,
    platform: 'instagram',
  },
  {
    href:     'mailto:hello@tnk.design',
    label:    'Email',
    Icon:     Mail,
    platform: 'email',
  },
]

const NAV_COLUMNS = [
  {
    title: 'Site',
    links: [
      { href: '/',         label: 'Home' },
      { href: '/projects', label: 'Projects' },
      { href: '/blog',     label: 'Blog' },
      { href: '/contact',  label: 'Contact' },
    ],
  },
  {
    title: 'Topics',
    links: [
      { href: '/blog?category=design',            label: 'Design' },
      { href: '/blog?category=analytics',         label: 'Analytics' },
      { href: '/blog?category=league-of-legends', label: 'League of Legends' },
      { href: '/blog?category=padel',             label: 'Padel' },
    ],
  },
  {
    title: 'Projects',
    links: [
      { href: '/projects?category=analytics',       label: 'Analytics Projects' },
      { href: '/projects?category=design',          label: 'Design Projects' },
      { href: '/projects?category=experimentation', label: 'Experimentation' },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/[0.06] mt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-[#00CFFF]/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group focus-ring w-fit">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00CFFF] to-[#00FFB3] rounded-lg opacity-20 group-hover:opacity-40 transition-opacity duration-200" />
                <div className="relative flex items-center justify-center w-full h-full">
                  <span className="font-display font-bold text-lg text-[#00CFFF]">T</span>
                  <span className="font-display font-bold text-lg text-[#00FFB3]">NK</span>
                </div>
              </div>
              <span className="font-display font-semibold text-[#F0F4FF]">TNK</span>
            </Link>

            <p className="text-[#8A9CC8] text-sm leading-relaxed max-w-xs mb-6">
              Design & Analytics. Turning data into decisions and pixels into stories. Based in Spain.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, label, Icon, platform }) => (
                <a
                  key={platform}
                  href={href}
                  target={platform !== 'email' ? '_blank' : undefined}
                  rel={platform !== 'email' ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  onClick={() => analytics.socialClick(platform, href)}
                  className={[
                    'p-2.5 rounded-lg text-[#4D5E87]',
                    'hover:text-[#00CFFF] hover:bg-[#00CFFF]/10',
                    'transition-[color,background-color] duration-200',
                    'focus-ring',
                  ].join(' ')}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLUMNS.map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[#4D5E87] mb-4">
                {title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={[
                        'text-sm text-[#8A9CC8]',
                        'hover:text-[#F0F4FF]',
                        'transition-[color] duration-200',
                        'focus-ring',
                      ].join(' ')}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#4D5E87]">
            © {year} Guillermo García — TNK Design & Analytics. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[#4D5E87] hover:text-[#8A9CC8] transition-[color] duration-200 focus-ring"
            >
              <Github size={14} />
              <span>Source</span>
              <ArrowUpRight size={12} />
            </a>
            <span className="text-[#4D5E87] text-xs">
              Built with Next.js & ♥
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
