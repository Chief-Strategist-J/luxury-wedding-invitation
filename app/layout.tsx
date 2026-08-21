import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'
import './globals.css'

const _cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const _jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),

  title: 'Arnav ♥ Kiara — Wedding Invitation',

  description:
    'A luxury 3D wedding invitation for the wedding of Arnav Patel & Kiara Patel. Tap to open, scratch to reveal, and celebrate our forever.',

  generator: 'v0.app',

  openGraph: {
    title: 'Arnav ♥ Kiara — AriaraKiShaadi',
    description:
      'A beautiful story awaits... Tap to open our wedding invitation.',
    type: 'website',
    images: [
      {
        url: '/media/logo-ak.png',
        width: 512,
        height: 512,
        alt: 'Arnav & Kiara Logo',
      },
    ],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#eef4fb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="bg-background text-foreground antialiased">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}