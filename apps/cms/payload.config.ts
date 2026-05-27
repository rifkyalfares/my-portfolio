import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'url'
import path from 'path'
import Projects from './src/collections/Projects'
import BlogPosts from './src/collections/BlogPosts'
import Skills from './src/collections/Skills'
import Experience from './src/collections/Experience'
import Users from './src/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.SERVER_URL || 'http://localhost:3001',
  admin: { user: 'users' },
  collections: [Users, Projects, BlogPosts, Skills, Experience],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
  }),
  typescript: {
    outputFile: path.resolve(dirname, '../shared/src/payload-types.ts'),
  },
  secret: process.env.PAYLOAD_SECRET || '',
})
