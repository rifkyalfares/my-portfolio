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
