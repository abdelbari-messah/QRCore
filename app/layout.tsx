import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Free QR Code Generator - Instant Custom QR Creation',
  description: 'Generate customizable QR codes instantly. Adjust colors, size, and add logos. Download as PNG or SVG. No signup required.',
  keywords: ['QR code', 'generator', 'free', 'custom', 'download', 'PNG', 'SVG'],
  generator: 'v0.app',
  openGraph: {
    title: 'Free QR Code Generator',
    description: 'Create beautiful, customized QR codes in seconds',
    type: 'website',
    images: [
      {
        url: '/social-og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free QR Code Generator',
    description: 'Create beautiful, customized QR codes in seconds',
    images: ['/social-og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background font-sans antialiased text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
