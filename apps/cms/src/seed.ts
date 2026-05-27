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
