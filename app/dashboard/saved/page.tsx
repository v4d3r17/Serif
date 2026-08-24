import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import { BlogCard } from '@/components/blog-card'

export default async function SavedPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: saves, error } = await supabase
    .from('blog_saves')
    .select(`
      blogs (
        *,
        profiles(first_name, avatar_url),
        blog_likes(user_id),
        blog_saves(user_id)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Saved Stories</h1>
        <p className="text-muted-foreground text-sm font-medium">
          Posts you&apos;ve bookmarked for later reading.
        </p>
      </div>

      {!saves || saves.length === 0 ? (
        <div className="py-20 text-center border rounded-xl border-dashed bg-muted/20">
          <p className="text-muted-foreground">You haven't saved any blogs yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {saves.map((save: unknown) => {
            const blog = Array.isArray((save as any).blogs) ? (save as any).blogs[0] : (save as any).blogs;
            if (!blog) return null;

            const author = Array.isArray(blog.profiles) ? blog.profiles[0] : blog.profiles;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const authorName = (author as any)?.first_name || 'Anonymous';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const authorAvatar = (author as any)?.avatar_url || '';
            
            const likeCount = blog.blog_likes?.length || 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isLiked = blog.blog_likes?.some((l: any) => l.user_id === user.id) || false;
            const isSaved = true; // inherently saved if it's in this list

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
