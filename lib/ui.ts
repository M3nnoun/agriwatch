import clsx, { type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

export const SEVERITY_STYLES: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  critical: { bg: 'bg-red-950', text: 'text-red-300', border: 'border-red-700', label: 'Critical' },
  high: { bg: 'bg-orange-950', text: 'text-orange-300', border: 'border-orange-700', label: 'High' },
  medium: {
    bg: 'bg-amber-950',
    text: 'text-amber-300',
    border: 'border-amber-700',
    label: 'Medium',
  },
  low: { bg: 'bg-yellow-950', text: 'text-yellow-300', border: 'border-yellow-800', label: 'Low' },
  normal: {
    bg: 'bg-emerald-950',
    text: 'text-emerald-300',
    border: 'border-emerald-800',
    label: 'Normal',
  },
}

export const LANGUAGE_LABELS: Record<string, string> = {
  ar: 'Arabic',
  sw: 'Swahili',
  fr: 'French',
  en: 'English',
}

export function ndviColor(ndvi: number): string {
  if (ndvi >= 0.55) return '#22c55e'
  if (ndvi >= 0.45) return '#84cc16'
  if (ndvi >= 0.35) return '#eab308'
  if (ndvi >= 0.25) return '#f97316'
  return '#ef4444'
}
