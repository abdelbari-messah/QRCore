'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const isValidHex = /^#[0-9A-F]{6}$/i.test(value)

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value.toUpperCase()
    if (!hex.startsWith('#')) {
      hex = '#' + hex
    }
    if (hex.length <= 7) {
      onChange(hex)
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent"
            aria-label={label || 'Color picker'}
          />
        </div>
        <Input
          type="text"
          value={value}
          onChange={handleHexChange}
          placeholder="#000000"
          className="flex-1 font-mono text-sm"
          maxLength={7}
        />
        {!isValidHex && value !== '' && (
          <p className="text-xs text-destructive">Invalid hex</p>
        )}
      </div>
    </div>
  )
}
