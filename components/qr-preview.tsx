'use client'

import { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { Card } from '@/components/ui/card'

type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'
type CornerSquareType = 'square' | 'dot' | 'extra-rounded'
type CornerDotType = 'square' | 'dot'

function mapDotStyle(style: 'square' | 'rounded' | 'dot'): DotType {
  switch (style) {
    case 'square':
      return 'square'
    case 'rounded':
      return 'rounded'
    case 'dot':
      return 'dots'
    default:
      return 'square'
  }
}

function mapMarkerBorderStyle(style: 'square' | 'rounded' | 'circle'): CornerSquareType {
  switch (style) {
    case 'square':
      return 'square'
    case 'rounded':
      return 'extra-rounded'
    case 'circle':
      return 'dot'
    default:
      return 'square'
  }
}

function mapMarkerCenterStyle(style: 'square' | 'dot'): CornerDotType {
  switch (style) {
    case 'square':
      return 'square'
    case 'dot':
      return 'dot'
    default:
      return 'square'
  }
}

interface QRPreviewProps {
  value: string
  size: number
  darkColor: string
  lightColor: string
  includeMargin: boolean
  level: 'L' | 'M' | 'Q' | 'H'
  logo?: string
  logoSize?: number
  dotStyle?: 'square' | 'rounded' | 'dot'
  markerBorder?: 'square' | 'rounded' | 'circle'
  markerCenter?: 'square' | 'dot'
}

export function QRPreview({
  value,
  size,
  darkColor,
  lightColor,
  includeMargin,
  level,
  logo,
  logoSize = 25,
  dotStyle = 'square',
  markerBorder = 'square',
  markerCenter = 'square',
}: QRPreviewProps) {
  const qrRef = useRef<HTMLDivElement>(null)
  const qrInstanceRef = useRef<QRCodeStyling | null>(null)
  const renderScale = 4

  useEffect(() => {
    if (!qrRef.current || !value) return

    const qr = new QRCodeStyling({
      width: size * renderScale,
      height: size * renderScale,
      data: value,
      image: logo,
      dotsOptions: {
        color: darkColor,
        type: mapDotStyle(dotStyle),
      },
      cornersSquareOptions: {
        color: darkColor,
        type: mapMarkerBorderStyle(markerBorder),
      },
      cornersDotOptions: {
        color: darkColor,
        type: mapMarkerCenterStyle(markerCenter),
      },
      backgroundOptions: {
        color: lightColor,
      },
      qrOptions: {
        errorCorrectionLevel: level,
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: Math.max(0.1, Math.min(0.5, logoSize / 100)),
        saveAsBlob: true,
        margin: 4,
      },
      margin: includeMargin ? 8 : 0,
    })

    qrInstanceRef.current = qr
    
    // Clear previous content
    if (qrRef.current.firstChild) {
      qrRef.current.removeChild(qrRef.current.firstChild)
    }

    qr.append(qrRef.current)

    const renderedElement = qrRef.current.firstElementChild as HTMLElement | null
    if (renderedElement) {
      renderedElement.style.width = `${size}px`
      renderedElement.style.height = `${size}px`
      renderedElement.style.maxWidth = '100%'
      renderedElement.style.maxHeight = '100%'
    }

    return () => {
      if (qrRef.current?.firstChild) {
        qrRef.current.removeChild(qrRef.current.firstChild)
      }
    }
  }, [value, size, darkColor, lightColor, level, logo, logoSize, dotStyle, markerBorder, markerCenter, includeMargin])

  return (
    <Card className="flex h-full flex-col items-center justify-center bg-card p-8">
      <div className="rounded-lg border border-border bg-background p-8">
        <div
          ref={qrRef}
          className="flex items-center justify-center"
          style={{ minHeight: size + 32, minWidth: size + 32 }}
        >
          {!value && (
            <p className="text-center text-sm text-muted-foreground">
              Enter text or URL to generate QR code
            </p>
          )}
        </div>
      </div>
      {value && (
        <p className="mt-4 text-xs text-muted-foreground">
          {value.length} characters
        </p>
      )}
    </Card>
  )
}
