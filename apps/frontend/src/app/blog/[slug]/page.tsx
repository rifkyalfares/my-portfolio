import { getBlogPost, getBlogPosts } from '@/lib/api'
import Footer from '@/components/layout/Footer'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)
  if (!post) notFound()

  return (
    <>
      <section className="mx-auto max-w-[680px] px-6 pb-16 pt-36">
        <div className="mb-3 flex gap-2">
          {post.tags.map((t) => (
            <span key={t.tag} className="text-[10px] uppercase tracking-[2px] text-violet-400">{t.tag}</span>
          ))}
        </div>
        <h1 className="mb-3 text-3xl font-black leading-tight tracking-tight">{post.title}</h1>
        <p className="mb-10 text-sm text-white/30">
          {new Date(post.published_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
        </p>
        {/* Rich text rendering — simple placeholder, replace with @payloadcms/richtext-lexical renderer */}
        <div className="prose prose-invert max-w-none text-white/60">
          <p>Article content rendered here via Payload rich text.</p>
        </div>
      </section>
      <Footer />
    </>
  )
}
