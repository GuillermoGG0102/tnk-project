import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { GTMProvider } from '@/components/analytics/GTMProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollDepthTracker } from '@/components/analytics/ScrollDepthTracker'
import '@/app/globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tnk.design'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'TNK – Design & Analytics',
    template: '%s | TNK – Design & Analytics',
  },
  description:
    'Portfolio and blog of Guillermo García — Digital Analytics Specialist & Designer. Data strategy, tracking implementation, creative design, and digital experimentation.',
  keywords: [
    'digital analytics', 'GA4', 'Google Tag Manager', 'data strategy',
    'web design', 'portfolio', 'experimentation', 'A/B testing',
    'measurement framework', 'UI design',
  ],
  authors: [{ name: 'Guillermo García', url: SITE_URL }],
  creator: 'Guillermo García',
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         SITE_URL,
    siteName:    'TNK – Design & Analytics',
    title:       'TNK – Design & Analytics',
    description: 'Digital Analytics Specialist & Designer. Data strategy, creative design, and digital experimentation.',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'TNK – Design & Analytics' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'TNK – Design & Analytics',
    description: 'Digital Analytics Specialist & Designer.',
    images:      [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index:               true,
    follow:              true,
    googleBot: {
      index:             true,
      follow:            true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':     -1,
    },
  },
  manifest: '/site.webmanifest',
  icons: {
    icon:    '/favicon.ico',
    shortcut:'/favicon-16x16.png',
    apple:   '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0F1E',
  width:      'device-width',
  initialScale: 1,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const gtmId = process.env.GTM_ID

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* GTM noscript fallback handled in GTMProvider */}
      </head>
      <body className="min-h-screen font-body antialiased">
        <ThemeProvider>
          {gtmId && <GTMProvider gtmId={gtmId} />}
          <ScrollDepthTracker />
          <Navbar />
          <main id="main-content" className="relative">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
