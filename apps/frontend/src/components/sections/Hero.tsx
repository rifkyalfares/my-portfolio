export default function Hero() {
  return (
    <section className="px-6 pb-20 pt-36">
      <div className="mx-auto max-w-[860px]">
        <div className="mb-6 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
          <span className="text-[11px] uppercase tracking-[3px] text-white/40">AI-Native Engineer</span>
        </div>
        <h1 className="mb-5 text-[clamp(40px,6vw,68px)] font-black leading-[1.05] tracking-[-2px]">
          Full Stack Dev<br />
          who{' '}
          <span className="text-violet-400">thinks with AI.</span>
        </h1>
        <p className="mb-8 max-w-[460px] text-[15px] leading-[1.75] text-white/35">
          "I don't just use AI tools —{' '}
          <span className="text-white/60">I think with them.</span>"
          <br />
          React · Next.js · Laravel · Anthropic · Docker
        </p>
        <div className="flex gap-3">
          <a
            href="#projects"
            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            View Projects
          </a>
          <a
            href="/cv.pdf"
            className="rounded-xl border border-white/[0.06] px-6 py-3 text-sm text-white/60 transition-colors hover:text-white"
          >
            Download CV
          </a>
        </div>
      </div>
    </section>
  )
}
