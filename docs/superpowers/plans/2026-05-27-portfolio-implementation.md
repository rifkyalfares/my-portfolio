# Portfolio Rifky Alfares — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a monorepo portfolio website (Next.js 14 + Payload CMS) with Liquid Glass Dark design, AI-Native Engineer branding, and PostgreSQL backend.

**Architecture:** Monorepo dengan npm workspaces — `apps/frontend` (Next.js 14 SSG), `apps/cms` (Payload CMS 2.x), `packages/shared` (TypeScript types). Frontend fetch data dari Payload REST API saat build + ISR revalidation.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, Payload CMS 2.x, PostgreSQL, Docker Compose, TypeScript, Lucide React

---

## File Map

```
my-portfolio/
├── package.json                          # workspace root
├── docker-compose.yml                    # postgres + cms + frontend
├── .gitignore
│
├── packages/
│   └── shared/
│       ├── package.json
│       └── src/
│           └── types.ts                  # Project, BlogPost, Skill, Experience types
│
├── apps/
│   ├── cms/
│   │   ├── package.json
│   │   ├── payload.config.ts             # collections + db config
│   │   ├── src/
│   │   │   ├── server.ts                 # express server
│   │   │   └── collections/
│   │   │       ├── Projects.ts
│   │   │       ├── BlogPosts.ts
│   │   │       ├── Skills.ts
│   │   │       └── Experience.ts
│   │   └── .env.example
│   │
│   └── frontend/
│       ├── package.json
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── .env.local.example
│       ├── src/
│       │   ├── lib/
│       │   │   └── api.ts                # fetch helpers untuk Payload REST API
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   │   ├── Navbar.tsx
│       │   │   │   └── Footer.tsx
│       │   │   ├── ui/
│       │   │   │   ├── GlassCard.tsx     # reusable glass card wrapper
│       │   │   │   ├── Badge.tsx         # skill badge
│       │   │   │   └── MorphingBlobs.tsx # background FX
│       │   │   ├── sections/
│       │   │   │   ├── Hero.tsx
│       │   │   │   ├── SkillsStrip.tsx
│       │   │   │   ├── ProjectsGrid.tsx
│       │   │   │   ├── AICollab.tsx
│       │   │   │   ├── Experience.tsx
│       │   │   │   ├── BlogPreview.tsx
│       │   │   │   └── Contact.tsx
│       │   │   └── projects/
│       │   │       └── ProjectCard.tsx
│       │   └── app/
│       │       ├── layout.tsx            # root layout, navbar, blobs
│       │       ├── page.tsx              # homepage
│       │       ├── projects/
│       │       │   ├── page.tsx
│       │       │   └── [slug]/page.tsx
│       │       └── blog/
│       │           ├── page.tsx
│       │           └── [slug]/page.tsx
│       └── public/
```

---

## Phase 1 — Monorepo Scaffold & Infra

### Task 1: Init monorepo workspace

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `docker-compose.yml`

- [ ] **Step 1: Init root package.json dengan npm workspaces**

```json
{
  "name": "my-portfolio",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev:cms": "npm run dev --workspace=apps/cms",
    "dev:frontend": "npm run dev --workspace=apps/frontend",
    "build": "npm run build --workspace=apps/frontend"
  }
}
```

- [ ] **Step 2: Buat .gitignore**

```
node_modules/
.env
.env.local
dist/
.next/
.superpowers/
```

- [ ] **Step 3: Buat docker-compose.yml**

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: portfolio
      POSTGRES_PASSWORD: portfolio
      POSTGRES_DB: portfolio
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  cms:
    build: ./apps/cms
    ports:
      - '3001:3001'
    environment:
      DATABASE_URI: postgresql://portfolio:portfolio@postgres:5432/portfolio
      PAYLOAD_SECRET: changeme_in_production
      PORT: 3001
    depends_on:
      - postgres
    volumes:
      - ./apps/cms:/app
      - /app/node_modules

  frontend:
    build: ./apps/frontend
    ports:
      - '3000:3000'
    environment:
      NEXT_PUBLIC_CMS_URL: http://cms:3001
    depends_on:
      - cms

volumes:
  postgres_data:
```

- [ ] **Step 4: Commit**

```bash
git init
git add package.json .gitignore docker-compose.yml
git commit -m "chore: init monorepo workspace"
```

---

### Task 2: Scaffold shared types package

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/src/types.ts`

- [ ] **Step 1: Buat packages/shared/package.json**

```json
{
  "name": "@portfolio/shared",
  "version": "1.0.0",
  "main": "src/types.ts",
  "types": "src/types.ts"
}
```

- [ ] **Step 2: Buat packages/shared/src/types.ts**

```typescript
export interface Project {
  id: string
  title: string
  description: string
  stack: string[]
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
  tags: string[]
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
```

- [ ] **Step 3: Commit**

```bash
git add packages/
git commit -m "feat: add shared TypeScript types package"
```

---

## Phase 2 — Payload CMS

### Task 3: Scaffold Payload CMS app

**Files:**
- Create: `apps/cms/package.json`
- Create: `apps/cms/.env.example`
- Create: `apps/cms/payload.config.ts`
- Create: `apps/cms/src/server.ts`

- [ ] **Step 1: Buat apps/cms/package.json**

```json
{
  "name": "@portfolio/cms",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "payload": "^2.0.0",
    "express": "^4.18.0",
    "@payloadcms/db-postgres": "^2.0.0",
    "@payloadcms/richtext-lexical": "^2.0.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/express": "^4.17.0",
    "nodemon": "^3.0.0",
    "ts-node": "^10.9.0"
  }
}
```

- [ ] **Step 2: Buat apps/cms/.env.example**

```
DATABASE_URI=postgresql://portfolio:portfolio@localhost:5432/portfolio
PAYLOAD_SECRET=your_secret_here
PORT=3001
```

- [ ] **Step 3: Install dependencies**

```bash
cd apps/cms && npm install
```

Expected: node_modules terbuat di apps/cms/

- [ ] **Step 4: Commit**

```bash
git add apps/cms/package.json apps/cms/.env.example
git commit -m "chore: scaffold cms package"
```

---

### Task 4: Buat Payload collections

**Files:**
- Create: `apps/cms/src/collections/Projects.ts`
- Create: `apps/cms/src/collections/BlogPosts.ts`
- Create: `apps/cms/src/collections/Skills.ts`
- Create: `apps/cms/src/collections/Experience.ts`

- [ ] **Step 1: Buat apps/cms/src/collections/Projects.ts**

```typescript
import { CollectionConfig } from 'payload/types'

const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'stack', type: 'array', fields: [{ name: 'name', type: 'text' }] },
    { name: 'ai_role', type: 'text' },
    { name: 'github_url', type: 'text' },
    { name: 'live_url', type: 'text' },
    { name: 'cover_image', type: 'upload', relationTo: 'media' },
  ],
}

export default Projects
```

- [ ] **Step 2: Buat apps/cms/src/collections/BlogPosts.ts**

```typescript
import { CollectionConfig } from 'payload/types'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'content', type: 'richText', editor: lexicalEditor({}) },
    { name: 'published_at', type: 'date', required: true },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
  ],
}

export default BlogPosts
```

- [ ] **Step 3: Buat apps/cms/src/collections/Skills.ts**

```typescript
import { CollectionConfig } from 'payload/types'

const Skills: CollectionConfig = {
  slug: 'skills',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      options: ['frontend', 'backend', 'database', 'ai', 'infra'],
      required: true,
    },
    { name: 'is_ai_featured', type: 'checkbox', defaultValue: false },
  ],
}

export default Skills
```

- [ ] **Step 4: Buat apps/cms/src/collections/Experience.ts**

```typescript
import { CollectionConfig } from 'payload/types'

const Experience: CollectionConfig = {
  slug: 'experience',
  admin: { useAsTitle: 'company' },
  fields: [
    { name: 'company', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'start_date', type: 'date', required: true },
    { name: 'end_date', type: 'date' },
    { name: 'description', type: 'textarea', required: true },
  ],
}

export default Experience
```

- [ ] **Step 5: Commit**

```bash
git add apps/cms/src/collections/
git commit -m "feat: add Payload CMS collections"
```

---

### Task 5: Buat payload.config.ts dan server

**Files:**
- Create: `apps/cms/payload.config.ts`
- Create: `apps/cms/src/server.ts`

- [ ] **Step 1: Buat apps/cms/payload.config.ts**

```typescript
import { buildConfig } from 'payload/config'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import Projects from './src/collections/Projects'
import BlogPosts from './src/collections/BlogPosts'
import Skills from './src/collections/Skills'
import Experience from './src/collections/Experience'

export default buildConfig({
  serverURL: process.env.SERVER_URL || 'http://localhost:3001',
  admin: { user: 'users' },
  collections: [Projects, BlogPosts, Skills, Experience],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
  }),
  typescript: { outputFile: '../shared/src/payload-types.ts' },
})
```

- [ ] **Step 2: Buat apps/cms/src/server.ts**

```typescript
import express from 'express'
import payload from 'payload'
import 'dotenv/config'

const app = express()

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  app.listen(Number(process.env.PORT) || 3001, () => {
    console.log(`CMS running on port ${process.env.PORT || 3001}`)
  })
}

start()
```

- [ ] **Step 3: Copy .env.example ke .env dan isi nilai**

```bash
cp apps/cms/.env.example apps/cms/.env
```

Edit `DATABASE_URI`, `PAYLOAD_SECRET` sesuai lokal.

- [ ] **Step 4: Jalankan postgres via Docker**

```bash
docker compose up postgres -d
```

Expected: container `postgres` running

- [ ] **Step 5: Jalankan CMS dev**

```bash
npm run dev:cms
```

Expected: `Payload Admin URL: http://localhost:3001/admin` di terminal. Buka browser → `http://localhost:3001/admin` → setup admin user.

- [ ] **Step 6: Commit**

```bash
git add apps/cms/payload.config.ts apps/cms/src/server.ts
git commit -m "feat: configure Payload CMS server"
```

---

### Task 6: Seed dummy data

**Files:**
- Create: `apps/cms/src/seed.ts`

- [ ] **Step 1: Buat apps/cms/src/seed.ts**

```typescript
import payload from 'payload'
import 'dotenv/config'

const seed = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    local: true,
  })

  // Skills
  const skillsData = [
    { name: 'React', category: 'frontend', is_ai_featured: false },
    { name: 'Next.js', category: 'frontend', is_ai_featured: false },
    { name: 'Angular', category: 'frontend', is_ai_featured: false },
    { name: 'Node.js', category: 'backend', is_ai_featured: false },
    { name: 'Laravel', category: 'backend', is_ai_featured: false },
    { name: 'Lumen', category: 'backend', is_ai_featured: false },
    { name: 'Anthropic', category: 'ai', is_ai_featured: true },
    { name: 'Gemini', category: 'ai', is_ai_featured: true },
    { name: 'PostgreSQL', category: 'database', is_ai_featured: false },
    { name: 'MySQL', category: 'database', is_ai_featured: false },
    { name: 'Docker', category: 'infra', is_ai_featured: false },
  ]
  for (const skill of skillsData) {
    await payload.create({ collection: 'skills', data: skill })
  }

  // Projects
  const projectsData = [
    {
      title: 'Project Alpha',
      slug: 'project-alpha',
      description: 'Aplikasi fullstack dengan Next.js dan Anthropic Claude sebagai AI layer.',
      stack: [{ name: 'Next.js' }, { name: 'Anthropic' }, { name: 'PostgreSQL' }],
      ai_role: 'Generative AI untuk fitur X',
      github_url: 'https://github.com/rifkyalfares/project-alpha',
    },
    {
      title: 'Project Beta',
      slug: 'project-beta',
      description: 'REST API Laravel dengan integrasi Gemini untuk summarization otomatis.',
      stack: [{ name: 'Laravel' }, { name: 'Gemini' }, { name: 'MySQL' }],
      ai_role: 'Summarization pipeline',
      github_url: 'https://github.com/rifkyalfares/project-beta',
    },
    {
      title: 'Project Gamma',
      slug: 'project-gamma',
      description: 'Dashboard analytics real-time dengan React dan Node.js.',
      stack: [{ name: 'React' }, { name: 'Node.js' }, { name: 'Docker' }],
      ai_role: '',
      github_url: 'https://github.com/rifkyalfares/project-gamma',
    },
  ]
  for (const project of projectsData) {
    await payload.create({ collection: 'projects', data: project })
  }

  // Experience
  await payload.create({
    collection: 'experience',
    data: {
      company: 'Company Name',
      role: 'Full Stack Engineer',
      start_date: '2022-01-01',
      description: 'Membangun dan memelihara aplikasi web fullstack.',
    },
  })

  // Blog Posts
  await payload.create({
    collection: 'blog-posts',
    data: {
      title: 'How I Build with AI: My Workflow',
      slug: 'how-i-build-with-ai',
      published_at: new Date().toISOString(),
      tags: [{ tag: 'AI' }, { tag: 'Engineering' }],
      content: { root: { children: [] } },
    },
  })

  console.log('Seed complete.')
  process.exit(0)
}

seed()
```

- [ ] **Step 2: Jalankan seed**

```bash
cd apps/cms && npx ts-node src/seed.ts
```

Expected: `Seed complete.` tanpa error. Cek di `http://localhost:3001/admin` → semua collections terisi.

- [ ] **Step 3: Commit**

```bash
git add apps/cms/src/seed.ts
git commit -m "chore: add dummy data seed script"
```

---

## Phase 3 — Next.js Frontend

### Task 7: Scaffold Next.js app

**Files:**
- Create: `apps/frontend/package.json`
- Create: `apps/frontend/next.config.ts`
- Create: `apps/frontend/tailwind.config.ts`
- Create: `apps/frontend/.env.local.example`

- [ ] **Step 1: Buat apps/frontend/package.json**

```json
{
  "name": "@portfolio/frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "lucide-react": "^0.378.0",
    "@portfolio/shared": "*"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

- [ ] **Step 2: Buat apps/frontend/next.config.ts**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3001' },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 3: Buat apps/frontend/tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#8b5cf6',
        'accent-dim': 'rgba(139,92,246,0.15)',
        bg: '#06000f',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Buat apps/frontend/.env.local.example**

```
NEXT_PUBLIC_CMS_URL=http://localhost:3001
```

- [ ] **Step 5: Install dependencies**

```bash
cd apps/frontend && npm install
```

- [ ] **Step 6: Commit**

```bash
git add apps/frontend/
git commit -m "chore: scaffold Next.js frontend app"
```

---

### Task 8: API helper dan root layout

**Files:**
- Create: `apps/frontend/src/lib/api.ts`
- Create: `apps/frontend/src/app/layout.tsx`
- Create: `apps/frontend/src/app/globals.css`

- [ ] **Step 1: Buat apps/frontend/src/lib/api.ts**

```typescript
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
```

- [ ] **Step 2: Buat apps/frontend/src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    background-color: #06000f;
    color: #ffffff;
    font-family: Inter, system-ui, sans-serif;
  }
}

@keyframes morph {
  0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50%  { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
  100% { border-radius: 70% 30% 50% 50% / 40% 60% 40% 60%; }
}

.animate-morph {
  animation: morph 12s ease-in-out infinite alternate;
}

@media (prefers-reduced-motion: reduce) {
  .animate-morph { animation: none; }
}
```

- [ ] **Step 3: Buat apps/frontend/src/app/layout.tsx**

```typescript
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import MorphingBlobs from '@/components/ui/MorphingBlobs'

export const metadata: Metadata = {
  title: 'Rifky Alfares — AI-Native Engineer',
  description: 'Full Stack Dev who thinks with AI. React, Next.js, Laravel, Anthropic, Docker.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen overflow-x-hidden">
        <MorphingBlobs />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/frontend/src/
git commit -m "feat: add API helpers and root layout"
```

---

### Task 9: UI primitives (MorphingBlobs, GlassCard, Badge, Navbar, Footer)

**Files:**
- Create: `apps/frontend/src/components/ui/MorphingBlobs.tsx`
- Create: `apps/frontend/src/components/ui/GlassCard.tsx`
- Create: `apps/frontend/src/components/ui/Badge.tsx`
- Create: `apps/frontend/src/components/layout/Navbar.tsx`
- Create: `apps/frontend/src/components/layout/Footer.tsx`

- [ ] **Step 1: Buat MorphingBlobs.tsx**

```typescript
export default function MorphingBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="animate-morph absolute -right-24 -top-36 h-[500px] w-[500px]"
        style={{ background: 'rgba(139,92,246,0.20)', filter: 'blur(80px)' }}
      />
      <div
        className="animate-morph absolute -bottom-20 -left-16 h-[350px] w-[350px]"
        style={{
          background: 'rgba(109,40,217,0.15)',
          filter: 'blur(80px)',
          animationDelay: '-4s',
        }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Buat GlassCard.tsx**

```typescript
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
}

export default function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn('rounded-2xl backdrop-blur-xl', className)}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Buat apps/frontend/src/lib/utils.ts**

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Install deps: `cd apps/frontend && npm install clsx tailwind-merge`

- [ ] **Step 4: Buat Badge.tsx**

```typescript
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
```

- [ ] **Step 5: Buat Navbar.tsx**

```typescript
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav
      className="fixed left-1/2 top-4 z-50 flex w-[calc(100%-3rem)] max-w-[820px] -translate-x-1/2 items-center justify-between rounded-2xl px-5 py-3 backdrop-blur-xl"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Link href="/" className="text-[15px] font-extrabold tracking-tight">
        rifky<span className="text-violet-500">.</span>dev
      </Link>
      <div className="flex gap-6 text-sm text-white/45">
        <Link href="/projects" className="transition-colors hover:text-white">Projects</Link>
        <Link href="/blog" className="transition-colors hover:text-white">Blog</Link>
      </div>
      <a
        href="mailto:rifkyalfares22@gmail.com"
        className="rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
      >
        Hire Me
      </a>
    </nav>
  )
}
```

- [ ] **Step 6: Buat Footer.tsx**

```typescript
export default function Footer() {
  return (
    <footer
      className="mt-16 flex justify-between px-6 py-7 text-xs text-white/25"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <span>rifky.dev — 2025</span>
      <span>rifkyalfares22@gmail.com</span>
    </footer>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add apps/frontend/src/components/ apps/frontend/src/lib/
git commit -m "feat: add UI primitives — blobs, glass card, badge, navbar, footer"
```

---

### Task 10: Homepage sections

**Files:**
- Create: `apps/frontend/src/components/sections/Hero.tsx`
- Create: `apps/frontend/src/components/sections/SkillsStrip.tsx`
- Create: `apps/frontend/src/components/sections/ProjectsGrid.tsx`
- Create: `apps/frontend/src/components/sections/AICollab.tsx`
- Create: `apps/frontend/src/components/sections/ExperienceSection.tsx`
- Create: `apps/frontend/src/components/sections/BlogPreview.tsx`
- Create: `apps/frontend/src/components/sections/Contact.tsx`
- Create: `apps/frontend/src/components/projects/ProjectCard.tsx`

- [ ] **Step 1: Buat Hero.tsx**

```typescript
export default function Hero() {
  return (
    <section className="px-6 pb-20 pt-36">
      <div className="mx-auto max-w-[860px]">
        <div className="mb-6 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
          <span className="text-[11px] uppercase tracking-[3px] text-white/40">AI-Native Engineer</span>
        </div>
        <h1 className="mb-5 text-[clamp(40px,6vw,68px)] font-black leading-[1.05] tracking-[-2px]">
          Full Stack Dev<br />
          who{' '}
          <span className="text-violet-400">thinks with AI.</span>
        </h1>
        <p className="mb-8 max-w-[460px] text-[15px] leading-[1.75] text-white/35">
          "I don't just use AI tools —{' '}
          <span className="text-white/60">I think with them.</span>"
          <br />
          React · Next.js · Laravel · Anthropic · Docker
        </p>
        <div className="flex gap-3">
          <a
            href="#projects"
            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            View Projects
          </a>
          <a
            href="/cv.pdf"
            className="rounded-xl border border-white/[0.06] px-6 py-3 text-sm text-white/60 transition-colors hover:text-white"
          >
            Download CV
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Buat SkillsStrip.tsx**

```typescript
import type { Skill } from '@portfolio/shared'
import Badge from '@/components/ui/Badge'

export default function SkillsStrip({ skills }: { skills: Skill[] }) {
  return (
    <div
      className="mx-auto flex max-w-[860px] flex-wrap gap-2 px-6 py-6"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {skills.map((skill) => (
        <Badge key={skill.id} name={skill.name} featured={skill.is_ai_featured} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Buat ProjectCard.tsx**

```typescript
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
```

- [ ] **Step 4: Buat ProjectsGrid.tsx**

```typescript
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
```

- [ ] **Step 5: Buat AICollab.tsx**

```typescript
export default function AICollab() {
  return (
    <section className="mx-auto max-w-[860px] px-6 py-4">
      <div
        className="rounded-2xl p-8"
        style={{
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.18)',
        }}
      >
        <p className="mb-3 text-[11px] uppercase tracking-[3px] text-white/25">How I work</p>
        <h2 className="mb-3 text-xl font-extrabold">AI Collaboration</h2>
        <p className="max-w-[500px] text-sm leading-[1.75] text-white/40">
          Bukan sekadar pakai Copilot. Saya merancang prompt, membangun agentic workflow,
          dan mengintegrasikan LLM ke dalam arsitektur produksi nyata — dari ideasi hingga
          deployment.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Buat ExperienceSection.tsx**

```typescript
import type { Experience } from '@portfolio/shared'

export default function ExperienceSection({ experience }: { experience: Experience[] }) {
  return (
    <section className="mx-auto max-w-[860px] px-6 py-16">
      <p className="mb-2 text-[11px] uppercase tracking-[3px] text-white/25">Timeline</p>
      <h2 className="mb-8 text-2xl font-extrabold tracking-tight">Experience</h2>
      <div className="flex flex-col gap-6 border-l border-white/[0.06] pl-6">
        {experience.map((exp) => (
          <div key={exp.id}>
            <p className="mb-1 text-xs text-white/30">
              {new Date(exp.start_date).getFullYear()} —{' '}
              {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
            </p>
            <h3 className="font-bold">{exp.role}</h3>
            <p className="text-sm text-violet-400">{exp.company}</p>
            <p className="mt-1 text-sm leading-relaxed text-white/40">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Buat BlogPreview.tsx**

```typescript
import Link from 'next/link'
import type { BlogPost } from '@portfolio/shared'
import GlassCard from '@/components/ui/GlassCard'

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  const preview = posts.slice(0, 2)
  return (
    <section className="mx-auto max-w-[860px] px-6 py-16">
      <p className="mb-2 text-[11px] uppercase tracking-[3px] text-white/25">Writing</p>
      <h2 className="mb-8 text-2xl font-extrabold tracking-tight">Blog</h2>
      <div className="flex flex-col gap-4">
        {preview.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <GlassCard className="cursor-pointer p-5 transition-colors hover:border-violet-500/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{post.title}</h3>
                  <div className="mt-1.5 flex gap-2">
                    {post.tags.map((t) => (
                      <span key={t.tag} className="text-[10px] text-white/30">{t.tag}</span>
                    ))}
                  </div>
                </div>
                <span className="shrink-0 text-xs text-white/25">
                  {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 8: Buat Contact.tsx**

```typescript
import { Github, Linkedin, Mail } from 'lucide-react'

export default function Contact() {
  return (
    <section className="mx-auto max-w-[860px] px-6 py-16">
      <p className="mb-2 text-[11px] uppercase tracking-[3px] text-white/25">Get in touch</p>
      <h2 className="mb-6 text-2xl font-extrabold tracking-tight">Contact</h2>
      <div className="flex gap-4">
        <a
          href="mailto:rifkyalfares22@gmail.com"
          className="flex items-center gap-2 rounded-xl border border-white/[0.06] px-4 py-2.5 text-sm text-white/50 transition-colors hover:border-violet-500/30 hover:text-white"
        >
          <Mail size={16} /> rifkyalfares22@gmail.com
        </a>
        <a
          href="https://github.com/rifkyalfares"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-white/[0.06] px-4 py-2.5 text-sm text-white/50 transition-colors hover:border-violet-500/30 hover:text-white"
        >
          <Github size={16} /> GitHub
        </a>
        <a
          href="https://linkedin.com/in/rifkyalfares"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-white/[0.06] px-4 py-2.5 text-sm text-white/50 transition-colors hover:border-violet-500/30 hover:text-white"
        >
          <Linkedin size={16} /> LinkedIn
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 9: Commit**

```bash
git add apps/frontend/src/components/sections/ apps/frontend/src/components/projects/
git commit -m "feat: add all homepage sections"
```

---

### Task 11: Homepage page.tsx

**Files:**
- Create: `apps/frontend/src/app/page.tsx`

- [ ] **Step 1: Buat apps/frontend/src/app/page.tsx**

```typescript
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
```

- [ ] **Step 2: Jalankan frontend dev**

```bash
npm run dev:frontend
```

Buka `http://localhost:3000` — homepage harus tampil lengkap dengan data dari CMS.

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/app/page.tsx
git commit -m "feat: homepage — wire all sections to CMS data"
```

---

### Task 12: Projects pages

**Files:**
- Create: `apps/frontend/src/app/projects/page.tsx`
- Create: `apps/frontend/src/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Buat apps/frontend/src/app/projects/page.tsx**

```typescript
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
```

- [ ] **Step 2: Buat apps/frontend/src/app/projects/[slug]/page.tsx**

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/app/projects/
git commit -m "feat: add projects list and detail pages"
```

---

### Task 13: Blog pages

**Files:**
- Create: `apps/frontend/src/app/blog/page.tsx`
- Create: `apps/frontend/src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Buat apps/frontend/src/app/blog/page.tsx**

```typescript
import { getBlogPosts } from '@/lib/api'
import Link from 'next/link'
import GlassCard from '@/components/ui/GlassCard'
import Footer from '@/components/layout/Footer'

export const revalidate = 3600

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return (
    <>
      <section className="mx-auto max-w-[860px] px-6 pb-16 pt-36">
        <p className="mb-2 text-[11px] uppercase tracking-[3px] text-white/25">Writing</p>
        <h1 className="mb-10 text-3xl font-black tracking-tight">Blog</h1>
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <GlassCard className="cursor-pointer p-5 transition-colors hover:border-violet-500/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">{post.title}</h2>
                    <div className="mt-2 flex gap-2">
                      {post.tags.map((t) => (
                        <span key={t.tag} className="text-[10px] text-violet-400">{t.tag}</span>
                      ))}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-white/25">
                    {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Buat apps/frontend/src/app/blog/[slug]/page.tsx**

```typescript
import { getBlogPost, getBlogPosts } from '@/lib/api'
import Footer from '@/components/layout/Footer'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)
  if (!post) notFound()

  return (
    <>
      <section className="mx-auto max-w-[680px] px-6 pb-16 pt-36">
        <div className="mb-3 flex gap-2">
          {post.tags.map((t) => (
            <span key={t.tag} className="text-[10px] uppercase tracking-[2px] text-violet-400">{t.tag}</span>
          ))}
        </div>
        <h1 className="mb-3 text-3xl font-black leading-tight tracking-tight">{post.title}</h1>
        <p className="mb-10 text-sm text-white/30">
          {new Date(post.published_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
        </p>
        {/* Rich text rendering — simple placeholder, replace with @payloadcms/richtext-lexical renderer */}
        <div className="prose prose-invert max-w-none text-white/60">
          <p>Article content rendered here via Payload rich text.</p>
        </div>
      </section>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/app/blog/
git commit -m "feat: add blog list and post detail pages"
```

---

## Phase 4 — GitHub Repo & Issues

### Task 14: Buat GitHub repo dan push

- [ ] **Step 1: Buat repo di GitHub**

```bash
gh repo create rifkyalfares/my-portfolio --public --description "AI-Native Engineer Portfolio — Next.js 14 + Payload CMS" --source=. --remote=origin --push
```

Expected: repo terbuat di `github.com/rifkyalfares/my-portfolio`

- [ ] **Step 2: Verifikasi**

```bash
gh repo view rifkyalfares/my-portfolio
```

---

### Task 15: Buat GitHub Issues dari plan ini

- [ ] **Step 1: Buat labels**

```bash
gh label create "phase:infra" --color "#0075ca" --description "Monorepo & Docker setup"
gh label create "phase:cms" --color "#e4e669" --description "Payload CMS setup"
gh label create "phase:frontend" --color "#d93f0b" --description "Next.js frontend"
gh label create "phase:deploy" --color "#0e8a16" --description "Deploy & CI"
```

- [ ] **Step 2: Buat issues Phase 1 (Infra)**

```bash
gh issue create --title "[Infra] Init monorepo workspace" \
  --label "phase:infra" \
  --body "Init root package.json dengan npm workspaces, .gitignore, docker-compose.yml (postgres + cms + frontend). Ref: Plan Task 1."

gh issue create --title "[Infra] Scaffold shared types package" \
  --label "phase:infra" \
  --body "Buat packages/shared/src/types.ts dengan types: Project, BlogPost, Skill, Experience, PaginatedResponse. Ref: Plan Task 2."
```

- [ ] **Step 3: Buat issues Phase 2 (CMS)**

```bash
gh issue create --title "[CMS] Scaffold Payload CMS app" \
  --label "phase:cms" \
  --body "Setup apps/cms dengan Payload CMS 2.x, PostgreSQL adapter, package.json, .env.example. Ref: Plan Task 3."

gh issue create --title "[CMS] Buat Payload collections" \
  --label "phase:cms" \
  --body "Buat 4 collections: Projects, BlogPosts, Skills, Experience dengan semua fields sesuai spec. Ref: Plan Task 4."

gh issue create --title "[CMS] Konfigurasi payload.config.ts dan server" \
  --label "phase:cms" \
  --body "Wire payload.config.ts + Express server. Test: admin panel bisa diakses di localhost:3001/admin. Ref: Plan Task 5."

gh issue create --title "[CMS] Seed dummy data" \
  --label "phase:cms" \
  --body "Buat seed script untuk Projects, Skills, Experience, BlogPosts dengan data dummy. Ref: Plan Task 6."
```

- [ ] **Step 4: Buat issues Phase 3 (Frontend)**

```bash
gh issue create --title "[Frontend] Scaffold Next.js 14 app" \
  --label "phase:frontend" \
  --body "Setup apps/frontend dengan Next.js 14 App Router, Tailwind CSS, konfigurasi workspace. Ref: Plan Task 7."

gh issue create --title "[Frontend] API helpers dan root layout" \
  --label "phase:frontend" \
  --body "Buat src/lib/api.ts (fetch dari Payload REST API) dan root layout dengan Navbar + MorphingBlobs. Ref: Plan Task 8."

gh issue create --title "[Frontend] UI primitives" \
  --label "phase:frontend" \
  --body "Buat MorphingBlobs, GlassCard, Badge, Navbar, Footer sesuai Liquid Glass Dark design system. Ref: Plan Task 9."

gh issue create --title "[Frontend] Homepage sections" \
  --label "phase:frontend" \
  --body "Buat semua sections: Hero, SkillsStrip, ProjectsGrid, AICollab, ExperienceSection, BlogPreview, Contact. Ref: Plan Task 10."

gh issue create --title "[Frontend] Wire homepage page.tsx" \
  --label "phase:frontend" \
  --body "Wire semua sections ke CMS data di app/page.tsx dengan SSG + revalidate. Ref: Plan Task 11."

gh issue create --title "[Frontend] Projects pages" \
  --label "phase:frontend" \
  --body "Buat /projects (list) dan /projects/[slug] (detail) dengan generateStaticParams. Ref: Plan Task 12."

gh issue create --title "[Frontend] Blog pages" \
  --label "phase:frontend" \
  --body "Buat /blog (list) dan /blog/[slug] (detail) dengan generateStaticParams. Ref: Plan Task 13."
```

- [ ] **Step 5: Verifikasi semua issues terbuat**

```bash
gh issue list
```

Expected: 11 issues terbuat dengan labels yang sesuai.

- [ ] **Step 6: Commit**

```bash
git add docs/
git commit -m "docs: add implementation plan"
git push
```

---

## Self-Review Checklist

- [x] Monorepo scaffold — Task 1
- [x] Shared types — Task 2
- [x] Payload CMS + collections — Task 3–5
- [x] Dummy data seed — Task 6
- [x] Next.js scaffold — Task 7
- [x] API helpers — Task 8
- [x] UI primitives (blobs, glass, badge, navbar, footer) — Task 9
- [x] Semua 8 sections homepage — Task 10
- [x] Homepage page.tsx — Task 11
- [x] Projects pages — Task 12
- [x] Blog pages — Task 13
- [x] GitHub repo + issues — Task 14–15
- [x] SSG + revalidation — Task 8 (api.ts tags) + Task 11 (revalidate)
- [x] Docker Compose — Task 1
- [x] Dummy data — Task 6
- [x] Single purple accent design system — Task 7 (tailwind) + Task 9 (components)
