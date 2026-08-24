import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/server'
import { ArrowLeft, ArrowRight } from 'lucide-react'

// Define the expected params
interface Props {
  params: Promise<{
    slug: string
  }>
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: blog } = await supabase
    .from('blogs')
    .select('title, summary, image_url, created_at, profiles:user_id(first_name)')
    .eq('slug', slug)
    .eq('status', 'Published')
    .single()

  if (!blog) {
    return {
      title: 'Blog Not Found | Serif',
      description: 'The requested blog post could not be found.'
    }
  }

  // Determine canonical URL dynamically or use a placeholder if none is set
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://serif.com'
  const canonicalUrl = `${baseUrl}/blogs/${slug}`

  return {
    title: `${blog.title} | Serif`,
    description: blog.summary,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: blog.title,
      description: blog.summary || undefined,
      url: canonicalUrl,
      type: 'article',
      publishedTime: blog.created_at,
      authors: [(blog.profiles as any)?.first_name || 'Anonymous'],
      images: blog.image_url ? [
        {
          url: blog.image_url,
          width: 1200,
          height: 630,
          alt: blog.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.summary || undefined,
      images: blog.image_url ? [blog.image_url] : [],
    },
  }
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  let blog = null;
  let nextBlog = null;

  if (slug.startsWith('dummy-')) {
    const dummyId = parseInt(slug.replace('dummy-', ''));
    blog = {
      id: slug,
      slug,
      title: `Dummy Blog ${dummyId}`,
      summary: 'This is a sample dummy blog to test the UI layout.',
      body: '<p>Artificial Intelligence is revolutionizing the way we build the web...</p>',
      image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200&h=800',
      created_at: new Date().toISOString(),
      read_time: 5,
      profiles: { first_name: 'Test Author', avatar_url: '' }
    }
    if (dummyId < 3) {
      nextBlog = {
        slug: `dummy-${dummyId + 1}`,
        title: `Dummy Blog ${dummyId + 1}`
      }
    } else {
      nextBlog = {
        slug: `dummy-1`,
        title: `Dummy Blog 1`
      }
    }
  } else {
    const { data: dbBlog } = await supabase
      .from('blogs')
      .select('*, profiles:user_id(first_name, avatar_url)')
      .eq('slug', slug)
      .eq('status', 'Published')
      .single()
    blog = dbBlog;

    if (blog) {
      let { data: nextDbBlog } = await supabase
        .from('blogs')
        .select('slug, title')
        .eq('status', 'Published')
        .lt('created_at', blog.created_at)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      if (!nextDbBlog) {
        // If there's no older blog, loop back to the newest one
        const { data: firstBlog } = await supabase
          .from('blogs')
          .select('slug, title')
          .eq('status', 'Published')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        nextDbBlog = firstBlog
      }
      
      nextBlog = nextDbBlog;
    }
  }

  if (!blog) {
    notFound()
  }

  // Construct JSON-LD Structured Data
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://serif.com'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.summary,
    image: blog.image_url ? [blog.image_url] : [],
    datePublished: blog.created_at,
    dateModified: blog.updated_at,
    author: {
      '@type': 'Person',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: blog.profiles?.first_name || 'Anonymous',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      image: blog.profiles?.avatar_url || undefined,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blogs/${slug}`
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Include JSON-LD script for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="px-4 md:px-20 py-4 md:py-6 border-b bg-background/50 backdrop-blur-md z-10 sticky top-0">
        <div className="w-full flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Serif Logo" width={140} height={140} className="w-auto h-[40px] md:h-[60px] object-contain" />
          </Link>
          <nav className="flex items-center gap-6 md:gap-12 lg:gap-16">
            <div className="hidden md:flex gap-10">
              <Link href="/#features" className="text-base font-medium hover:text-foreground/80 transition-colors">
                Features
              </Link>
              <Link href="/blogs" className="text-base font-medium hover:text-foreground/80 transition-colors">
                Blog
              </Link>
              <Link href="/#pricing" className="text-base font-medium hover:text-foreground/80 transition-colors">
                Pricing
              </Link>
            </div>
            <div className="flex items-center gap-4 md:gap-8">
              <Link href="/auth/login" className="text-sm md:text-base font-medium hover:underline underline-offset-4">
                Log in
              </Link>
              <Link href="/auth/sign-up" className="text-sm md:text-base font-medium bg-foreground text-background px-4 py-2 md:px-6 md:py-2.5 rounded-md hover:opacity-90 transition-opacity whitespace-nowrap">
                Sign up
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Article Content */}
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12 lg:py-16 max-w-4xl">
        <Link 
          href="/blogs" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all posts
        </Link>

        <article className="w-full">
          {/* Article Header */}
          <header className="mb-10 lg:mb-14">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-balance leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex items-center justify-between border-y py-4">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border bg-muted">
                  {blog.profiles?.avatar_url ? (
                    <Image
                      src={blog.profiles.avatar_url}
                      alt={blog.profiles.first_name || 'Author'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground text-sm font-medium">
                      {(blog.profiles?.first_name || 'A').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {blog.profiles?.first_name || 'Anonymous'}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <time dateTime={blog.created_at}>
                      {new Date(blog.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                    <span>•</span>
                    <span>{blog.read_time} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {blog.image_url && (
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-muted mb-12 shadow-md">
              <Image
                src={blog.image_url}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Body using Typography Plugin */}
          <div 
            className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: blog.body || '' }}
          />
          
          {/* Next Blog Navigation */}
          {nextBlog && (
            <div className="border-t pt-8 mt-12 flex justify-end">
              <Link 
                href={`/blogs/${nextBlog.slug}`}
                className="group flex flex-col items-end text-right transition-colors"
              >
                <span className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  Next Article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-xl font-bold group-hover:text-primary transition-colors">
                  {nextBlog.title}
                </span>
              </Link>
            </div>
          )}
        </article>
      </main>
    </div>
  )
}
