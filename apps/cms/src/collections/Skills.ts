import { CollectionConfig } from 'payload'

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
