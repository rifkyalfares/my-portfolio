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
