import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Plus, FileEdit, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreatePostDropdown } from '@/components/create-post-dropdown'
import { DashboardHeading, DashboardMetricsGrid, DashboardMetricCard, DashboardSection } from '@/components/dashboard-animations'

export default async function DashboardHomePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const allCount = blogs?.length || 0;
  const draftCount = blogs?.filter(b => b.status === 'Draft').length || 0;
  const publishedCount = blogs?.filter(b => b.status === 'Published').length || 0;
  
  const recentBlogs = blogs?.slice(0, 3) || [];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-10">
      <DashboardHeading>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-bold tracking-tight">Home</h1>
            <p className="text-muted-foreground text-sm font-medium">
              Welcome back! Here is your dashboard overview.
            </p>
          </div>
          <CreatePostDropdown />
        </div>
      </DashboardHeading>
      
      {/* Metrics Row */}
      <DashboardMetricsGrid>
        <DashboardMetricCard>
          <div className="serif-card-3d rounded-xl border bg-card/60 backdrop-blur-md text-card-foreground shadow p-6 flex flex-col justify-between">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Total Blogs</h3>
              <FileText className="h-4 w-4 text-blue-500" />
            </div>
            <div className="pt-2">
              <div className="text-3xl font-bold">{allCount}</div>
              <p className="text-xs text-muted-foreground mt-1">All time created</p>
            </div>
          </div>
        </DashboardMetricCard>
        
        <DashboardMetricCard>
          <div className="serif-card-3d rounded-xl border bg-card/60 backdrop-blur-md text-card-foreground shadow p-6 flex flex-col justify-between">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Published</h3>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="pt-2">
              <div className="text-3xl font-bold">{publishedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Live on your site</p>
            </div>
          </div>
        </DashboardMetricCard>

        <DashboardMetricCard>
          <div className="serif-card-3d rounded-xl border bg-card/60 backdrop-blur-md text-card-foreground shadow p-6 flex flex-col justify-between">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Drafts</h3>
              <FileEdit className="h-4 w-4 text-orange-500" />
            </div>
            <div className="pt-2">
              <div className="text-3xl font-bold">{draftCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Work in progress</p>
            </div>
          </div>
        </DashboardMetricCard>
      </DashboardMetricsGrid>

      {/* Recent Activity */}
      <DashboardSection delay={0.2}>
        <div className="rounded-xl border bg-card/60 backdrop-blur-md text-card-foreground shadow-sm p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
            <p className="text-sm text-muted-foreground font-medium">
              Jump back into your most recently updated posts.
            </p>
          </div>

          {recentBlogs.length === 0 ? (
            <div className="py-12 text-center border rounded-xl border-dashed bg-muted/20">
              <p className="text-sm text-muted-foreground mb-4">You don&apos;t have any blog posts yet.</p>
              <Button render={<Link href="/dashboard/blogs/new" />} nativeButton={false} className="rounded-full px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-none">
                Create your first post
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {recentBlogs.map((blog) => (
                <Link 
                  href={`/dashboard/blogs/${blog.id}/edit`} 
                  key={blog.id}
                  className="serif-card-3d flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border bg-background/50 p-5 hover:bg-muted/50 transition-colors gap-4 group cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-base group-hover:text-blue-600 transition-colors">{blog.title}</span>
                    <span className="text-xs text-muted-foreground font-medium">
                      Updated {new Date(blog.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={blog.status === 'Published' ? 'default' : 'secondary'} className="rounded-full px-3 shadow-none">
                      {blog.status}
                    </Badge>
                  </div>
                </Link>
              ))}
              <div className="mt-2 text-center">
                <Link href="/dashboard/blogs" className="text-sm text-blue-600 font-medium hover:underline">
                  View all blogs &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </DashboardSection>
    </div>
  )
}
