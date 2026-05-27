import { Github, Linkedin, Mail } from 'lucide-react'

export default function Contact() {
  return (
    <section className="mx-auto max-w-[860px] px-6 py-16">
      <p className="mb-2 text-[11px] uppercase tracking-[3px] text-white/25">Get in touch</p>
      <h2 className="mb-6 text-2xl font-extrabold tracking-tight">Contact</h2>
      <div className="flex gap-4">
        <a
          href="mailto:rifkyalfares22@gmail.com"
          className="flex items-center gap-2 rounded-xl border border-white/[0.06] px-4 py-2.5 text-sm text-white/50 transition-colors hover:border-violet-500/30 hover:text-white"
        >
          <Mail size={16} /> rifkyalfares22@gmail.com
        </a>
        <a
          href="https://github.com/rifkyalfares"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-white/[0.06] px-4 py-2.5 text-sm text-white/50 transition-colors hover:border-violet-500/30 hover:text-white"
        >
          <Github size={16} /> GitHub
        </a>
        <a
          href="https://linkedin.com/in/rifkyalfares"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-white/[0.06] px-4 py-2.5 text-sm text-white/50 transition-colors hover:border-violet-500/30 hover:text-white"
        >
          <Linkedin size={16} /> LinkedIn
        </a>
      </div>
    </section>
  )
}
