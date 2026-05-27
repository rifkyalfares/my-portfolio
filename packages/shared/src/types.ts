export interface Project {
  id: string
  title: string
  description: string
  stack: { name: string }[]
  ai_role: string
  github_url?: string
  live_url?: string
  cover_image?: { url: string; alt: string }
  slug: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: Record<string, unknown> // Payload rich text
  published_at: string
  tags: { tag: string }[]
}

export interface Skill {
  id: string
  name: string
  category: string
  is_ai_featured: boolean
}

export interface Experience {
  id: string
  company: string
  role: string
  start_date: string
  end_date?: string
  description: string
}

export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
}
