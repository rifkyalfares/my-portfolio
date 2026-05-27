import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import MorphingBlobs from '@/components/ui/MorphingBlobs'

export const metadata: Metadata = {
  title: 'Rifky Alfares — AI-Native Engineer',
  description: 'Full Stack Dev who thinks with AI. React, Next.js, Laravel, Anthropic, Docker.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen overflow-x-hidden">
        <MorphingBlobs />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  )
}
