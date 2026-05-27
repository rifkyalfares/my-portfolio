import type { Project } from '@portfolio/shared'
import ProjectCard from '@/components/projects/ProjectCard'

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const preview = projects.slice(0, 3)
  return (
    <section id="projects" className="mx-auto max-w-[860px] px-6 py-16">
      <p className="mb-2 text-[11px] uppercase tracking-[3px] text-white/25">Selected Work</p>
      <h2 className="mb-8 text-2xl font-extrabold tracking-tight">Projects</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {preview.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
        <a
          href="https://github.com/rifkyalfares"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[160px] cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/[0.08] text-sm text-white/20 transition-colors hover:border-white/20 hover:text-white/40"
        >
          More on GitHub
        </a>
      </div>
    </section>
  )
}
