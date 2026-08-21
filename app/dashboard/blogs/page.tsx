import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default async function BlogsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allCount = blogs?.length || 0;
  const draftCount = blogs?.filter(b => b.status === 'Draft').length || 0;
  const publishedCount = blogs?.filter(b => b.status === 'Published').length || 0;
  const scheduledCount = 0;

  const renderBlogList = (filterStatus?: string) => {
    let filteredBlogs = blogs || [];
    if (filterStatus) {
      filteredBlogs = filteredBlogs.filter(b => b.status === filterStatus);
    }
    
    if (filteredBlogs.length === 0) {
      return (
        <div className="py-6 text-center text-sm text-muted-foreground border rounded-xl mt-4 border-dashed">
          No blog posts found.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 mt-4">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border p-5 hover:bg-muted/40 transition-colors gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-base">{blog.title}</span>
              <span className="text-xs text-muted-foreground font-medium">
                Updated {new Date(blog.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})} - {blog.read_time} min read
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={blog.status === 'Published' ? 'default' : 'secondary'} className="rounded-full px-3 shadow-none">
                {blog.status}
              </Badge>
              <Button variant="ghost" size="icon-sm" render={<Link href={`/dashboard/blogs/${blog.id}/edit`} />} nativeButton={false}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
        <p className="text-muted-foreground text-sm font-medium">
          Review drafts, scheduled posts, and everything that is live.
        </p>
      </div>

      <div className="rounded-[1.25rem] border bg-card text-card-foreground shadow-sm p-6 sm:p-8 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-tight">Your blog posts</h2>
            <p className="text-sm text-muted-foreground font-medium">
              Track drafts, scheduled, and published posts.
            </p>
          </div>
          <Button render={<Link href="/dashboard/blogs/new" />} nativeButton={false} className="rounded-full px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-none font-medium h-9 text-sm">
            New Post
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start rounded-full bg-muted/60 p-1.5 h-auto border">
            <TabsTrigger value="all" className="rounded-full flex-1 py-1.5 text-xs font-semibold data-active:shadow-sm">All ({allCount})</TabsTrigger>
            <TabsTrigger value="draft" className="rounded-full flex-1 py-1.5 text-xs font-semibold data-active:shadow-sm">Draft ({draftCount})</TabsTrigger>
            <TabsTrigger value="published" className="rounded-full flex-1 py-1.5 text-xs font-semibold data-active:shadow-sm">Published ({publishedCount})</TabsTrigger>
            <TabsTrigger value="scheduled" className="rounded-full flex-1 py-1.5 text-xs font-semibold data-active:shadow-sm disabled:opacity-50">Scheduled ({scheduledCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-2 outline-none">{renderBlogList()}</TabsContent>
          <TabsContent value="draft" className="mt-2 outline-none">{renderBlogList('Draft')}</TabsContent>
          <TabsContent value="published" className="mt-2 outline-none">{renderBlogList('Published')}</TabsContent>
          <TabsContent value="scheduled" className="mt-2 outline-none">{renderBlogList('Scheduled')}</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
