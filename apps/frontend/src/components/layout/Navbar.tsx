import Link from 'next/link'

export default function Navbar() {
  return (
    <nav
      className="fixed left-1/2 top-4 z-50 flex w-[calc(100%-3rem)] max-w-[820px] -translate-x-1/2 items-center justify-between rounded-2xl px-5 py-3 backdrop-blur-xl"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Link href="/" className="text-[15px] font-extrabold tracking-tight">
        rifky<span className="text-violet-500">.</span>dev
      </Link>
      <div className="flex gap-6 text-sm text-white/45">
        <Link href="/projects" className="transition-colors hover:text-white">Projects</Link>
        <Link href="/blog" className="transition-colors hover:text-white">Blog</Link>
      </div>
      <a
        href="mailto:rifkyalfares22@gmail.com"
        className="rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
      >
        Hire Me
      </a>
    </nav>
  )
}
