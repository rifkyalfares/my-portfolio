import { getBlogPosts } from '@/lib/api'
import Link from 'next/link'
import GlassCard from '@/components/ui/GlassCard'
import Footer from '@/components/layout/Footer'

export const revalidate = 3600

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return (
    <>
      <section className="mx-auto max-w-[860px] px-6 pb-16 pt-36">
        <p className="mb-2 text-[11px] uppercase tracking-[3px] text-white/25">Writing</p>
        <h1 className="mb-10 text-3xl font-black tracking-tight">Blog</h1>
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <GlassCard className="cursor-pointer p-5 transition-colors hover:border-violet-500/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">{post.title}</h2>
                    <div className="mt-2 flex gap-2">
                      {post.tags.map((t) => (
                        <span key={t.tag} className="text-[10px] text-violet-400">{t.tag}</span>
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
      <Footer />
    </>
  )
}
