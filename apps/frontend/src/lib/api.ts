import type { Project, BlogPost, Skill, Experience, PaginatedResponse } from '@portfolio/shared'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

async function fetchCMS<T>(path: string, tags: string[]): Promise<T> {
  const res = await fetch(`${CMS_URL}/api${path}`, {
    next: { tags },
  })
  if (!res.ok) throw new Error(`CMS fetch failed: ${path}`)
  return res.json()
}

export async function getProjects(): Promise<Project[]> {
  const data = await fetchCMS<PaginatedResponse<Project>>('/projects?limit=100', ['projects'])
  return data.docs
}

export async function getProject(slug: string): Promise<Project> {
  const data = await fetchCMS<PaginatedResponse<Project>>(
    `/projects?where[slug][equals]=${slug}&limit=1`,
    ['projects']
  )
  return data.docs[0]
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await fetchCMS<PaginatedResponse<BlogPost>>(
    '/blog-posts?sort=-published_at&limit=100',
    ['blog-posts']
  )
  return data.docs
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  const data = await fetchCMS<PaginatedResponse<BlogPost>>(
    `/blog-posts?where[slug][equals]=${slug}&limit=1`,
    ['blog-posts']
  )
  return data.docs[0]
}

export async function getSkills(): Promise<Skill[]> {
  const data = await fetchCMS<PaginatedResponse<Skill>>('/skills?limit=100', ['skills'])
  return data.docs
}

export async function getExperience(): Promise<Experience[]> {
  const data = await fetchCMS<PaginatedResponse<Experience>>(
    '/experience?sort=-start_date&limit=100',
    ['experience']
  )
  return data.docs
}
