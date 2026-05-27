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
