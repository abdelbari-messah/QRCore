'use client'

import { useState, useRef } from 'react'
import { QRPreview } from './qr-preview'
import { QRCustomization } from './qr-customization'
import { generateTimestamp } from '@/lib/qr-utils'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'

export function QRGenerator() {
  const [value, setValue] = useState('')
  const [size, setSize] = useState(250)
  const [darkColor, setDarkColor] = useState('#000000')
  const [lightColor, setLightColor] = useState('#ffffff')
  const [format, setFormat] = useState<'png' | 'svg'>('png')
  const [includeMargin, setIncludeMargin] = useState(true)
  const [logo, setLogo] = useState<string | undefined>(undefined)
  const [logoSize, setLogoSize] = useState(25)
  const [dotStyle, setDotStyle] = useState<'square' | 'rounded' | 'dot'>('square')
  const [markerBorder, setMarkerBorder] = useState<'square' | 'rounded' | 'circle'>('square')
  const [markerCenter, setMarkerCenter] = useState<'square' | 'dot'>('square')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownload = async (downloadFormat: 'png' | 'svg') => {
    if (!value) return

    try {
      const timestamp = generateTimestamp()
      const filename = `qr-code-${timestamp}`

      if (downloadFormat === 'png') {
        const canvas = qrRef.current?.querySelector('canvas') as HTMLCanvasElement | null

        if (!canvas) {
          console.error('Canvas element not found')
          return
        }

        // Convert canvas to PNG and download
        canvas.toBlob((blob) => {
          if (!blob) return
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${filename}.png`
          link.click()
          URL.revokeObjectURL(url)
        }, 'image/png')
      } else if (downloadFormat === 'svg') {
        // SVG export coming in next phase
        console.log('SVG export coming soon')
      }
    } catch (error) {
      console.error('Error downloading QR code:', error)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    if (typeof document !== 'undefined') {
      const html = document.documentElement
      if (newTheme === 'dark') {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Free QR Code Generator
              </h1>
              <p className="mt-2 text-muted-foreground">
                Create beautiful, customized QR codes instantly. No signup required.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="ml-4"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Preview Section */}
            <div ref={qrRef} className="flex items-center justify-center">
              <QRPreview
                value={value}
                size={size}
                darkColor={darkColor}
                lightColor={lightColor}
                includeMargin={includeMargin}
                level="M"
                logo={logo}
                logoSize={logoSize}
                dotStyle={dotStyle}
                markerBorder={markerBorder}
                markerCenter={markerCenter}
              />
            </div>

            {/* Customization Section */}
            <div className="flex flex-col">
              <QRCustomization
                value={value}
                onValueChange={setValue}
                size={size}
                onSizeChange={setSize}
                darkColor={darkColor}
                onDarkColorChange={setDarkColor}
                lightColor={lightColor}
                onLightColorChange={setLightColor}
                format={format}
                onFormatChange={setFormat}
                onDownload={handleDownload}
                includeMargin={includeMargin}
                onMarginChange={setIncludeMargin}
                logo={logo}
                onLogoChange={setLogo}
                logoSize={logoSize}
                onLogoSizeChange={setLogoSize}
                dotStyle={dotStyle}
                onDotStyleChange={setDotStyle}
                markerBorder={markerBorder}
                onMarkerBorderChange={setMarkerBorder}
                markerCenter={markerCenter}
                onMarkerCenterChange={setMarkerCenter}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Ad space */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Ad space - Add your ads here */}
          <div className="mb-8 min-h-24 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Ad space available</p>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 Free QR Code Generator. No data is stored or shared.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
