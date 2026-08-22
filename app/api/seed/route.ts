import { NextResponse } from 'next/server'
import { createClient } from '@/lib/server'

export async function POST() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Create 5 dummy blogs
  const dummyBlogs = [
    {
      user_id: user.id,
      title: 'The Future of Web Development with AI',
      summary: 'Exploring how artificial intelligence is reshaping the way we write code and design interfaces in 2026.',
      body: '# The AI Revolution\n\nArtificial intelligence is fundamentally changing how we approach web development. From intelligent code completion to automated UI generation, developers now have access to tools that were considered science fiction just a decade ago.\n\n## Generative UI\n\nFrameworks are starting to embrace generative UI...',
      image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
      status: 'Published',
      read_time: 4,
      slug: 'future-of-web-dev-ai-' + Math.random().toString(36).substring(7)
    },
    {
      user_id: user.id,
      title: 'Mastering Tailwind CSS and Glassmorphism',
      summary: 'A deep dive into creating beautiful, modern, translucent interfaces using Tailwind CSS backdrop filters.',
      body: '# Glassmorphism is Here to Stay\n\nGlassmorphism—the design trend characterized by translucent, frosted-glass-like elements—has become a staple of modern web design. \n\n## Tailwind makes it easy\n\nWith utilities like `backdrop-blur-md` and `bg-white/10`, creating stunning depth is trivial.',
      image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000',
      status: 'Published',
      read_time: 3,
      slug: 'mastering-tailwind-glassmorphism-' + Math.random().toString(36).substring(7)
    },
    {
      user_id: user.id,
      title: 'Why Server Components Change Everything',
      summary: 'React Server Components are confusing at first, but they solve some of the biggest problems in web architecture.',
      body: '# RSCs: A New Paradigm\n\nReact Server Components allow you to render components exclusively on the server, sending zero JavaScript to the client. This dramatically reduces bundle sizes and improves SEO.\n\n## Data Fetching\n\nYou can now await your database directly in your component.',
      image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000',
      status: 'Published',
      read_time: 6,
      slug: 'server-components-change-everything-' + Math.random().toString(36).substring(7)
    },
    {
      user_id: user.id,
      title: 'My Morning Routine as a Software Engineer',
      summary: 'Coffee, code reviews, and deep work. Here is how I structure my day for maximum productivity.',
      body: '# Starting the Day Right\n\nI wake up at 6 AM. First thing: a strong cup of coffee. I avoid checking emails until 9 AM. The first two hours of my day are dedicated strictly to deep, uninterrupted coding.\n\n## The Power of Focus\n\nContext switching is the enemy of productivity.',
      image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000',
      status: 'Draft',
      read_time: 2,
      slug: 'morning-routine-engineer-' + Math.random().toString(36).substring(7)
    },
    {
      user_id: user.id,
      title: 'Designing for Dark Mode',
      summary: 'Dark mode is not just inverted colors. Learn the principles of contrast and elevation in dark UI.',
      body: '# Dark Mode Principles\n\nWhen designing dark interfaces, avoid pure black backgrounds. Instead, use a very dark gray. This reduces eye strain and allows you to use shadows for elevation (shadows on pure black are invisible).\n\n## Color Palette\n\nDesaturate your primary colors for dark mode to prevent them from vibrating against dark backgrounds.',
      image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000',
      status: 'Published',
      read_time: 5,
      slug: 'designing-for-dark-mode-' + Math.random().toString(36).substring(7)
    }
  ]

  const { error } = await supabase.from('blogs').insert(dummyBlogs)

  if (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, count: dummyBlogs.length })
}
