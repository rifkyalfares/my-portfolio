import { getProject, getProjects } from '@/lib/api'
import Footer from '@/components/layout/Footer'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)
  if (!project) notFound()

  return (
    <>
      <section className="mx-auto max-w-[860px] px-6 pb-16 pt-36">
        <p className="mb-2 text-[11px] uppercase tracking-[3px] text-violet-400">
          {project.ai_role ? 'AI + Full Stack' : 'Full Stack'}
        </p>
        <h1 className="mb-4 text-3xl font-black tracking-tight">{project.title}</h1>
        <p className="mb-8 max-w-[540px] text-base leading-relaxed text-white/50">
          {project.description}
        </p>
        {project.ai_role && (
          <div className="mb-6 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
            <p className="text-xs uppercase tracking-[2px] text-violet-400">AI Role</p>
            <p className="mt-1 text-sm text-white/60">{project.ai_role}</p>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span key={s.name} className="rounded bg-white/[0.04] px-2 py-1 text-xs text-white/35">
              {s.name}
            </span>
          ))}
        </div>
        <div className="mt-8 flex gap-3">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm text-white/50 hover:text-white">
              GitHub →
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer"
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
              Live Demo →
            </a>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}
