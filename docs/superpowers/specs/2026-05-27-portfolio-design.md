# Portfolio Design Spec
**Date:** 2026-05-27
**Owner:** Rifky Alfares

---

## 1. Overview

Personal portfolio website untuk Rifky Alfares — Full Stack Engineer yang berkolaborasi dengan AI. Tujuan: personal branding + job hunting (full-time). Target audience: recruiter, hiring manager, potential client.

---

## 2. Identity & Positioning

- **Tagline:** "Full Stack Dev who thinks with AI."
- **Sub-quote:** "I don't just use AI tools — I think with them."
- **Brand label:** AI-Native Engineer
- **Domain:** rifky.dev

---

## 3. Visual Design

### Style
**Liquid Glass Dark** — dark base dengan morphing blob animasi di background, konten di atas glass cards.

### Color
- **Background:** `#06000f` (deep dark purple-black)
- **Accent (single):** `#8b5cf6` (purple)
- **Accent dim:** `rgba(139,92,246,0.15)`
- **Accent border:** `rgba(139,92,246,0.20)`
- **Text primary:** `#ffffff`
- **Text muted:** `rgba(255,255,255,0.35)`
- **Text mid:** `rgba(255,255,255,0.60)`
- **Border:** `rgba(255,255,255,0.06)`

### Background FX
Dua morphing blob — pure purple, berbeda opacity (`0.20` dan `0.15`), posisi top-right dan bottom-left. Animasi `morph` 12s ease-in-out infinite alternate.

### Glass Cards
```css
background: rgba(255,255,255,0.03);
border: 1px solid rgba(255,255,255,0.06);
backdrop-filter: blur(20px);
```

### Typography
- **Font:** Inter (system fallback)
- **Hero title:** `clamp(40px, 6vw, 68px)`, weight 900, letter-spacing -2px
- **Body:** 15px, line-height 1.75
- **Labels:** 11px, letter-spacing 3px, uppercase

---

## 4. Architecture

**Pattern:** Monorepo

```
my-portfolio/
├── apps/frontend/     # Next.js 14 + Tailwind CSS
├── apps/cms/          # Payload CMS (admin panel)
├── packages/shared/   # Shared TypeScript types
├── docker-compose.yml
└── package.json       # workspace root (npm workspaces)
```

### Frontend — `apps/frontend`
- **Stack:** Next.js 14 (App Router), Tailwind CSS
- **Rendering:** SSG (Static Site Generation) + on-demand revalidation saat CMS update
- **Data source:** Payload CMS REST API

### CMS — `apps/cms`
- **Stack:** Payload CMS 2.x
- **Database:** PostgreSQL
- **Admin URL:** `/admin`
- **Collections:**
  - `projects` — title, description, stack[], ai_role, github_url, live_url, cover_image
  - `blog_posts` — title, slug, content (rich text), published_at, tags[]
  - `skills` — name, category, is_ai_featured (bool)
  - `experience` — company, role, start_date, end_date, description
- **Media:** local storage (dev), S3-compatible (prod)

### Shared — `packages/shared`
- TypeScript types yang di-generate dari Payload collections
- Digunakan di frontend untuk type-safe API calls

### Infra
- **Local dev:** Docker Compose (frontend + cms + postgres)
- **Deploy target:** VPS / Railway / Render

---

## 5. Pages & Sections

### Public Site (Next.js)

| Route | Section |
|-------|---------|
| `/` | Hero, Skills Strip, Projects (preview 3), AI Collab, Experience (preview), Blog (preview 2), Contact |
| `/projects` | Full project grid |
| `/projects/[slug]` | Project detail |
| `/blog` | Blog list |
| `/blog/[slug]` | Article detail |

### Admin (Payload CMS)
- `/admin` — dashboard Payload default
- Manage: Projects, Blog Posts, Skills, Experience

---

## 6. Section Detail

### Hero
- Label: `AI-NATIVE ENGINEER` (11px, letter-spacing 3px)
- H1: "Full Stack Dev who **thinks with AI.**" (accent purple)
- Sub: quote + stack ringkas
- CTA: "View Projects" (filled purple) + "Download CV" (ghost)
- Background: morphing blobs

### Skills Strip
- Semua badge: abu-abu/muted
- Exception: Anthropic & Gemini → highlight purple (featured)
- Stack: React, Next.js, Angular, Node.js, Laravel, Lumen, Anthropic, Gemini, PostgreSQL, MySQL, Docker

### Projects
- Grid 2 kolom
- Tiap card: type label (purple), name, description, tech tags
- Slot ke-4: "More on GitHub" dashed card
- Data dari Payload CMS, dummy saat development

### AI Collaboration
- Section khusus cerita cara kerja dengan AI
- Background: purple accent dim + border
- Isi: narasi workflow (prompt engineering → agentic → production integration)

### Experience
- Timeline format
- Data dari Payload CMS

### Blog
- Grid/list artikel teknis
- Data dari Payload CMS

### Contact
- Email link + social links (LinkedIn, GitHub)
- Form opsional (fase 2)

---

## 7. Data Flow

```
CMS Update → Payload webhook → Next.js revalidateTag() → SSG regenerate
```

Dev mode: fetch langsung dari Payload API (`http://localhost:3001/api`)
Prod mode: fetch saat build + ISR revalidation

---

## 8. Tech Stack Summary

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, Tailwind CSS, TypeScript |
| CMS | Payload CMS 2.x |
| Database | PostgreSQL |
| Shared | TypeScript types (npm workspace) |
| Infra | Docker Compose |
| Animation | CSS `@keyframes` + Intersection Observer |
| Icons | Lucide React |

---

## 9. Content Strategy

- Semua konten awal: **dummy data**
- Production content diisi via Payload admin panel
- Bahasa: campuran Indonesia/English (fleksibel per section)

---

## 10. Out of Scope (v1)

- Dark/light mode toggle
- Contact form (fase 2)
- Authentication frontend
- Search/filter blog
- i18n

---

## 11. Design Decisions

| Decision | Rationale |
|----------|-----------|
| Single purple accent | Mengurangi noise visual, fokus pada konten |
| Liquid Glass style | Unique, 2025 aesthetic, cocok dengan "AI-native" identity |
| Payload CMS | Self-hosted, TypeScript native, admin UI siap pakai |
| Monorepo | Shared types, satu repo satu deploy, cocok solo dev |
| SSG + revalidation | Performance optimal, SEO friendly |
