import { createClient } from '@/lib/server'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function BlogsPage() {
  const supabase = await createClient()

  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('*, profiles:user_id(first_name, avatar_url)')
    .eq('status', 'Published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blogs:', error)
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 -z-10">
        <Image 
          src="/background.png" 
          alt="Background" 
          fill 
          className="object-cover opacity-80" 
          priority
        />
      </div>
      
      <header className="px-4 md:px-20 py-4 md:py-6 border-b bg-background/50 backdrop-blur-md z-10">
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
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12 lg:py-24 z-10">
        <div className="flex flex-col items-center text-center mb-12 lg:mb-20">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-4">
            Blog
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-balance">
            Insights & Stories
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
            Discover our latest thoughts, updates, and deep dives into writing, AI, and productivity.
          </p>
        </div>

        {!blogs || blogs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No published blogs yet. Check back soon!
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div key={blog.id} className="group relative flex flex-col items-start justify-between rounded-2xl border bg-card p-4 transition-all hover:shadow-lg">
                <Link href={`/blogs/${blog.slug}`} className="absolute inset-0 z-10">
                  <span className="sr-only">View {blog.title}</span>
                </Link>
                
                <div className="w-full">
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-muted mb-6">
                    {blog.image_url ? (
                      <Image
                        src={blog.image_url}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                        <span className="text-muted-foreground text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <time dateTime={blog.created_at}>
                      {new Date(blog.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                    <span>•</span>
                    <span>{blog.read_time} min read</span>
                  </div>

                  <h3 className="text-xl font-bold leading-tight tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                    {blog.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between w-full mt-auto pt-4 border-t">
                  <div className="flex items-center gap-2 z-20">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border bg-muted">
                      {blog.profiles?.avatar_url ? (
                        <Image
                          src={blog.profiles.avatar_url}
                          alt={blog.profiles.first_name || 'Author'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground text-xs font-medium">
                          {(blog.profiles?.first_name || 'A').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {blog.profiles?.first_name || 'Anonymous'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm font-medium text-primary z-20">
                    Read more
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
