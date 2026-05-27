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
