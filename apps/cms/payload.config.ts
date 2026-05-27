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
