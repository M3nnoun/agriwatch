import { cn, SEVERITY_STYLES } from '@/lib/ui'

export function AlertBadge({ severity }: { severity: string }) {
  const s = SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.normal
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        s.bg,
        s.text,
        s.border
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', s.text.replace('text', 'bg'))} />
      {s.label}
    </span>
  )
}
