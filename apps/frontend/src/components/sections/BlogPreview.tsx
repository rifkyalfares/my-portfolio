import Link from 'next/link'
import type { BlogPost } from '@portfolio/shared'
import GlassCard from '@/components/ui/GlassCard'

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  const preview = posts.slice(0, 2)
  return (
    <section className="mx-auto max-w-[860px] px-6 py-16">
      <p className="mb-2 text-[11px] uppercase tracking-[3px] text-white/25">Writing</p>
      <h2 className="mb-8 text-2xl font-extrabold tracking-tight">Blog</h2>
      <div className="flex flex-col gap-4">
        {preview.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <GlassCard className="cursor-pointer p-5 transition-colors hover:border-violet-500/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{post.title}</h3>
                  <div className="mt-1.5 flex gap-2">
                    {post.tags.map((t) => (
                      <span key={t.tag} className="text-[10px] text-white/30">{t.tag}</span>
                    ))}
                  </div>
                </div>
                <span className="shrink-0 text-xs text-white/25">
                  {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  )
}
