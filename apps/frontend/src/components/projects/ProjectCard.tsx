import Link from 'next/link'
import type { Project } from '@portfolio/shared'
import GlassCard from '@/components/ui/GlassCard'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <GlassCard className="cursor-pointer p-6 transition-colors hover:border-violet-500/30">
        <p className="mb-2.5 text-[10px] uppercase tracking-[2px] text-violet-400">
          {project.ai_role ? 'AI + Full Stack' : 'Full Stack'}
        </p>
        <h3 className="mb-2 text-base font-bold">{project.title}</h3>
        <p className="mb-4 text-xs leading-[1.65] text-white/35">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span
              key={s.name}
              className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/35"
            >
              {s.name}
            </span>
          ))}
        </div>
      </GlassCard>
    </Link>
  )
}
