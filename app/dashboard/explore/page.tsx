import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import { BlogCard } from '@/components/blog-card'
import DepthCarousel from '@/components/ui/depth-carousel'

const dummyBlogs = [
  {
    id: 'dummy-1',
    slug: 'dummy-1',
    title: 'The Future of AI in Web Development',
    content_html: 'Artificial Intelligence is revolutionizing the way we build the web...',
    body: 'Artificial Intelligence is revolutionizing the way we build the web...',
    created_at: new Date().toISOString(),
    status: 'Published',
    user_id: 'dummy-user-1',
    profiles: { first_name: 'Alice', avatar_url: '' },
    blog_likes: [],
    blog_saves: []
  },
  {
    id: 'dummy-2',
    slug: 'dummy-2',
    title: '10 Tips for Better React Performance',
    content_html: 'Performance is a feature. Here are ten ways you can optimize your React applications today.',
    body: 'Performance is a feature. Here are ten ways you can optimize your React applications today.',
    created_at: new Date().toISOString(),
    status: 'Published',
    user_id: 'dummy-user-2',
    profiles: { first_name: 'Bob', avatar_url: '' },
    blog_likes: [],
    blog_saves: []
  },
  {
    id: 'dummy-3',
    slug: 'dummy-3',
    title: 'A Guide to Modern CSS Features',
    content_html: 'CSS has evolved rapidly. Let\'s explore container queries, subgrid, and color spaces.',
    body: 'CSS has evolved rapidly. Let\'s explore container queries, subgrid, and color spaces.',
    created_at: new Date().toISOString(),
    status: 'Published',
    user_id: 'dummy-user-3',
    profiles: { first_name: 'Charlie', avatar_url: '' },
    blog_likes: [],
    blog_saves: []
  }
];

const carouselItems = [
  { image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200&h=800', alt: 'Tech', href: '/blogs/dummy-1' },
  { image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=800', alt: 'Coding', href: '/blogs/dummy-2' },
  { image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=1200&h=800', alt: 'Workspace', href: '/blogs/dummy-3' },
  { image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200&h=800', alt: 'Team', href: '/blogs/dummy-1' },
  { image: 'https://images.unsplash.com/photo-1481481656513-33924300300f?auto=format&fit=crop&q=80&w=1200&h=800', alt: 'Design', href: '/blogs/dummy-2' }
];

export default async function ExplorePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: blogs, error } = await supabase
    .from('blogs')
    .select(`
      *,
      profiles(first_name, avatar_url),
      blog_likes(user_id),
      blog_saves(user_id)
    `)
    .eq('status', 'Published')
    .eq('visibility', 'Public')
    .order('created_at', { ascending: false })

  const allBlogs = [...(blogs || []), ...dummyBlogs];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Explore</h1>
        <p className="text-muted-foreground text-sm font-medium">
          Discover incredible stories published by the community.
        </p>
      </div>

      <div className="w-full h-[300px] md:h-[500px] relative">
        <DepthCarousel
          items={carouselItems}
          cardWidth={800}
          cardHeight={450}
          depth={220}
          spread={90}
          tilt={22}
          tiltDirection="right"
          perspective={1400}
          visibleCards={4}
          falloff={0.2}
          blur={6}
          autoplay
          loop
          showControls={false}
          showIndicators={false}
        />
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <h2 className="text-2xl font-semibold tracking-tight">Latest Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBlogs.map((blog) => {
            const author = Array.isArray(blog.profiles) ? blog.profiles[0] : blog.profiles;
            const authorName = author?.first_name || 'Anonymous';
            const authorAvatar = author?.avatar_url || '';
            
            const likeCount = blog.blog_likes?.length || 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isLiked = blog.blog_likes?.some((l: any) => l.user_id === user.id) || false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isSaved = blog.blog_saves?.some((s: any) => s.user_id === user.id) || false;

            return (
              <BlogCard
                key={blog.id}
                blog={blog}
                authorName={authorName}
                authorAvatar={authorAvatar}
                initialLiked={isLiked}
                initialSaved={isSaved}
                likeCount={likeCount}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

