import { cn } from '@/lib/utils'

interface BadgeProps {
  name: string
  featured?: boolean
}

export default function Badge({ name, featured = false }: BadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium',
        featured
          ? 'border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.15)] text-violet-400'
          : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] text-white/35'
      )}
    >
      {name}
    </span>
  )
}
