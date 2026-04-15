export async function downloadQRCode(
  canvasElement: HTMLCanvasElement | null,
  filename: string,
  format: 'png' | 'svg',
  scale: 1 | 2 | 4 = 1
) {
  if (!canvasElement) return

  try {
    if (format === 'png') {
      // Get canvas with scaling for higher quality
      const canvas = canvasElement as HTMLCanvasElement
      const link = document.createElement('a')
      link.download = `${filename}.png`

      // Increase resolution by drawing at scale
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) return

      tempCanvas.width = canvas.width * scale
      tempCanvas.height = canvas.height * scale

      tempCtx.imageSmoothingEnabled = false
      tempCtx.drawImage(
        canvas,
        0,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      )

      link.href = tempCanvas.toDataURL('image/png')
      link.click()
    } else if (format === 'svg') {
      // For SVG, we'll create a simple SVG wrapper
      // Note: Full SVG conversion would require additional processing
      console.log('SVG export coming soon')
    }
  } catch (error) {
    console.error('Error downloading QR code:', error)
  }
}

export function generateTimestamp(): string {
  const now = new Date()
  return now.toISOString().split('T')[0] + '-' + now.getTime().toString().slice(-6)
}
