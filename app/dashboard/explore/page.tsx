import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import { BlogCard } from '@/components/blog-card'

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
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Explore</h1>
        <p className="text-muted-foreground text-sm font-medium">
          Discover incredible stories published by the community.
        </p>
      </div>

      {!blogs || blogs.length === 0 ? (
        <div className="py-20 text-center border rounded-xl border-dashed bg-muted/20">
          <p className="text-muted-foreground">No community blogs have been published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const author = Array.isArray(blog.profiles) ? blog.profiles[0] : blog.profiles;
            const authorName = author?.first_name || 'Anonymous';
            const authorAvatar = author?.avatar_url || '';
            
            const likeCount = blog.blog_likes?.length || 0;
            const isLiked = blog.blog_likes?.some((l: any) => l.user_id === user.id) || false;
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
      )}
    </div>
  )
}
