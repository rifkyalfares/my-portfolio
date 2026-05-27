import { getProjects } from '@/lib/api'
import ProjectCard from '@/components/projects/ProjectCard'
import Footer from '@/components/layout/Footer'

export const revalidate = 3600

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <>
      <section className="mx-auto max-w-[860px] px-6 pb-16 pt-36">
        <p className="mb-2 text-[11px] uppercase tracking-[3px] text-white/25">All Work</p>
        <h1 className="mb-10 text-3xl font-black tracking-tight">Projects</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>
      <Footer />
    </>
  )
}
