import Hero from '@/components/sections/Hero'
import SkillsStrip from '@/components/sections/SkillsStrip'
import ProjectsGrid from '@/components/sections/ProjectsGrid'
import AICollab from '@/components/sections/AICollab'
import ExperienceSection from '@/components/sections/ExperienceSection'
import BlogPreview from '@/components/sections/BlogPreview'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/layout/Footer'
import { getSkills, getProjects, getExperience, getBlogPosts } from '@/lib/api'

export const revalidate = 3600 // revalidate every hour

export default async function HomePage() {
  const [skills, projects, experience, posts] = await Promise.all([
    getSkills(),
    getProjects(),
    getExperience(),
    getBlogPosts(),
  ])

  return (
    <>
      <Hero />
      <SkillsStrip skills={skills} />
      <ProjectsGrid projects={projects} />
      <AICollab />
      <ExperienceSection experience={experience} />
      <BlogPreview posts={posts} />
      <Contact />
      <Footer />
    </>
  )
}
