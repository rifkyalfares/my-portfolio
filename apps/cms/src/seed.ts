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
      title: 'AI Chat Platform',
      slug: 'ai-chat-platform',
      description: 'Platform chat fullstack dengan Next.js dan Anthropic Claude — streaming responses, conversation history, dan role-based access.',
      stack: [{ name: 'Next.js' }, { name: 'Anthropic' }, { name: 'PostgreSQL' }, { name: 'Docker' }],
      ai_role: 'Claude sebagai AI engine: streaming completion, tool use untuk web search, dan summarization percakapan otomatis.',
      github_url: 'https://github.com/rifkyalfares',
    },
    {
      title: 'Document Summarizer API',
      slug: 'document-summarizer-api',
      description: 'REST API Laravel untuk summarization dokumen otomatis menggunakan Gemini — support PDF, DOCX, dan plain text.',
      stack: [{ name: 'Laravel' }, { name: 'Gemini' }, { name: 'MySQL' }, { name: 'Docker' }],
      ai_role: 'Gemini sebagai summarization engine dengan chunking strategy untuk dokumen panjang.',
      github_url: 'https://github.com/rifkyalfares',
    },
    {
      title: 'Realtime Analytics Dashboard',
      slug: 'realtime-analytics-dashboard',
      description: 'Dashboard analytics real-time dengan React, Node.js, dan WebSocket — visualisasi event stream dan alerting.',
      stack: [{ name: 'React' }, { name: 'Node.js' }, { name: 'PostgreSQL' }, { name: 'Docker' }],
      ai_role: '',
      github_url: 'https://github.com/rifkyalfares',
    },
  ]
  for (const project of projectsData) {
    await payload.create({ collection: 'projects', data: project })
  }

  // Experience — update via CMS admin with real data
  await payload.create({
    collection: 'experience',
    data: {
      company: 'Your Company',
      role: 'Full Stack Engineer',
      start_date: '2022-01-01',
      description: 'Update entry ini lewat CMS admin dengan data experience yang sebenarnya.',
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
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              tag: 'h2',
              children: [{ type: 'text', text: 'Bukan sekadar Copilot' }],
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Kebanyakan developer pakai AI sebagai autocomplete. Saya memakainya sebagai thought partner — mulai dari desain arsitektur, debugging, hingga menulis prompt yang tepat untuk fitur spesifik.' }],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [{ type: 'text', text: 'Agentic workflow' }],
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Saya membangun agentic workflow menggunakan Anthropic SDK — tool use, multi-step reasoning, dan integrasi ke sistem produksi nyata. Bukan demo, bukan proof of concept.' }],
            },
          ],
        },
      },
    },
  })

  console.log('Seed complete.')
  process.exit(0)
}

seed()
