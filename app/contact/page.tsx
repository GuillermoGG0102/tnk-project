import type { Metadata } from 'next'
import { ContactForm }     from '@/components/contact/ContactForm'
import { Linkedin, Instagram, Mail, MapPin, MessageCircle } from 'lucide-react'
import { NewsletterForm }  from '@/components/blog/NewsletterForm'

export const metadata: Metadata = {
  title:       'Contact',
  description: 'Get in touch with Guillermo García for analytics consulting, design projects, or just to say hi.',
}

const CONTACT_INFO = [
  {
    Icon:    Mail,
    label:   'Email',
    value:   'hello@tnk.design',
    href:    'mailto:hello@tnk.design',
    color:   '#00CFFF',
  },
  {
    Icon:    Linkedin,
    label:   'LinkedIn',
    value:   'Guillermo García González-López',
    href:    'https://www.linkedin.com/in/guillermo-garc%C3%ADa-gonz%C3%A1lez-l%C3%B3pez/',
    color:   '#0A66C2',
  },
  {
    Icon:    Instagram,
    label:   'Instagram',
    value:   '@tnkdesigns_',
    href:    'https://www.instagram.com/tnkdesigns_/',
    color:   '#E1306C',
  },
  {
    Icon:    MapPin,
    label:   'Location',
    value:   'Spain',
    href:    undefined,
    color:   '#00FFB3',
  },
]

const SERVICES = [
  { label: 'Analytics Implementation', desc: 'GA4, GTM, custom event schemas' },
  { label: 'Measurement Strategy',     desc: 'Frameworks, KPIs, data governance' },
  { label: 'A/B Testing & CRO',        desc: 'Hypothesis design & analysis' },
  { label: 'UI / UX Design',           desc: 'Interfaces, design systems, branding' },
  { label: 'Data Visualisation',       desc: 'Dashboards, reports, storytelling' },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#00CFFF] mb-3">Get in touch</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gradient-primary tracking-tight mb-5">
            Let's talk
          </h1>
          <p className="text-[#8A9CC8] text-lg leading-relaxed">
            Whether you need an analytics implementation, a design project, or just want to connect —
            I'm always open to a conversation. Typically respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Contact info */}
            <div className="surface-card p-6 flex flex-col gap-5">
              <h2 className="font-display font-bold text-[#F0F4FF] text-lg">Contact info</h2>
              {CONTACT_INFO.map(({ Icon, label, value, href, color }) => (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}10` }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[#4D5E87] mb-0.5">{label}</div>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm text-[#8A9CC8] hover:text-[#F0F4FF] transition-[color] duration-200 truncate block focus-ring"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm text-[#8A9CC8]">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Services */}
            <div className="surface-card p-6">
              <h2 className="font-display font-bold text-[#F0F4FF] text-lg mb-5">How I can help</h2>
              <ul className="flex flex-col gap-4">
                {SERVICES.map(({ label, desc }) => (
                  <li key={label} className="flex gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00CFFF] shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-[#F0F4FF]">{label}</div>
                      <div className="text-xs text-[#4D5E87]">{desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability */}
            <div className="p-5 rounded-2xl bg-[#00FFB3]/5 border border-[#00FFB3]/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFB3] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FFB3]" />
                </span>
                <span className="text-sm font-semibold text-[#00FFB3]">Available for projects</span>
              </div>
              <p className="text-xs text-[#8A9CC8]">
                Currently accepting new freelance and consulting work. Remote-friendly.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-20">
          <NewsletterForm source="contact-page" />
        </div>
      </div>
    </div>
  )
}
