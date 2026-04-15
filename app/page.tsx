import { Metadata } from 'next'
import { QRGenerator } from '@/components/qr-generator'

export const metadata: Metadata = {
  title: 'Free QR Code Generator - Instant Custom QR Creation',
  description: 'Generate customizable QR codes instantly. Adjust colors, size, and add logos. Download as PNG or SVG. No signup required.',
  alternates: {
    canonical: 'https://qr.example.com',
  },
}

export default function Home() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I generate a QR code?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Simply enter a URL or text in the input field and the QR code will generate instantly. Customize colors, size, and add a logo if desired.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I customize the appearance of my QR code?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! You can change colors, adjust the size, add rounded corners, and overlay a custom logo on your QR code.',
        },
      },
      {
        '@type': 'Question',
        name: 'What formats can I download?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can download your QR code as PNG or SVG format in various resolutions.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is it free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, completely free! No signup or account required. Generate, customize, and download unlimited QR codes.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="min-h-screen bg-background">
        <QRGenerator />
      </main>
    </>
  )
}
