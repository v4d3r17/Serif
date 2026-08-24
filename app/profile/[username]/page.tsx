import { createClient } from '@/lib/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { BlogCard } from '@/components/blog-card'

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const supabase = await createClient()

  // Find profile by username
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) {
    return notFound()
  }

  // Fetch their public blogs
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('user_id', profile.id)
    .eq('status', 'Published')
    .eq('visibility', 'Public')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/60 backdrop-blur-md px-4 py-8 text-center">
        <div className="flex flex-col items-center gap-4">
          {profile.avatar_url ? (
            <Image 
              src={profile.avatar_url} 
              alt={profile.first_name || profile.username} 
              width={96} 
              height={96} 
              className="rounded-full object-cover w-24 h-24 shadow-sm"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary shadow-sm">
              {(profile.first_name || profile.username || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{profile.first_name || profile.username}</h1>
            <p className="text-muted-foreground mt-1">@{profile.username}</p>
          </div>
          {profile.bio && (
            <p className="max-w-xl mx-auto mt-2 text-muted-foreground">{profile.bio}</p>
          )}
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-6">Public Posts</h2>
        {blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(blog => (
              <BlogCard 
                key={blog.id} 
                blog={blog} 
                authorName={profile.first_name || profile.username} 
                authorAvatar={profile.avatar_url} 
                initialLiked={false} 
                initialSaved={false} 
                likeCount={0} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground bg-card/30 rounded-xl border border-dashed">
            This user hasn&apos;t published any public posts yet.
          </div>
        )}
      </main>
    </div>
  )
}
