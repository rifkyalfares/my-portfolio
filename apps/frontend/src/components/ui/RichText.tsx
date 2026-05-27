import React from 'react'

type LexicalNode = {
  type: string
  tag?: string
  format?: number
  text?: string
  url?: string
  children?: LexicalNode[]
  listType?: 'bullet' | 'number'
  value?: number
}

type LexicalRoot = {
  root: { children: LexicalNode[] }
}

function renderText(node: LexicalNode): React.ReactNode {
  if (!node.text) return null
  let el: React.ReactNode = node.text
  if (node.format) {
    if (node.format & 1) el = <strong>{el}</strong>
    if (node.format & 2) el = <em>{el}</em>
    if (node.format & 8) el = <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[0.85em] text-violet-300">{el}</code>
    if (node.format & 16) el = <s>{el}</s>
  }
  return el
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  switch (node.type) {
    case 'text':
      return <React.Fragment key={index}>{renderText(node)}</React.Fragment>

    case 'linebreak':
      return <br key={index} />

    case 'paragraph':
      return (
        <p key={index} className="mb-4 leading-[1.8] text-white/60">
          {node.children?.map((n, i) => renderNode(n, i))}
        </p>
      )

    case 'heading': {
      const Tag = (node.tag ?? 'h2') as 'h1' | 'h2' | 'h3' | 'h4'
      const cls: Record<string, string> = {
        h1: 'mb-4 mt-8 text-2xl font-black tracking-tight',
        h2: 'mb-3 mt-8 text-xl font-extrabold tracking-tight',
        h3: 'mb-2 mt-6 text-lg font-bold',
        h4: 'mb-2 mt-4 text-base font-semibold',
      }
      return (
        <Tag key={index} className={cls[node.tag ?? 'h2']}>
          {node.children?.map((n, i) => renderNode(n, i))}
        </Tag>
      )
    }

    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag key={index} className={`mb-4 pl-5 text-white/60 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
          {node.children?.map((n, i) => renderNode(n, i))}
        </Tag>
      )
    }

    case 'listitem':
      return (
        <li key={index} className="mb-1 leading-[1.8]">
          {node.children?.map((n, i) => renderNode(n, i))}
        </li>
      )

    case 'quote':
      return (
        <blockquote key={index} className="mb-4 border-l-2 border-violet-500/40 pl-4 text-white/40 italic">
          {node.children?.map((n, i) => renderNode(n, i))}
        </blockquote>
      )

    case 'link':
      return (
        <a
          key={index}
          href={node.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400 underline underline-offset-2 hover:text-violet-300"
        >
          {node.children?.map((n, i) => renderNode(n, i))}
        </a>
      )

    case 'horizontalrule':
      return <hr key={index} className="my-8 border-white/[0.06]" />

    default:
      return null
  }
}

export default function RichText({ content }: { content: LexicalRoot | Record<string, unknown> }) {
  const root = (content as LexicalRoot)?.root
  if (!root?.children?.length) return null
  return (
    <div className="max-w-none">
      {root.children.map((node, i) => renderNode(node, i))}
    </div>
  )
}
