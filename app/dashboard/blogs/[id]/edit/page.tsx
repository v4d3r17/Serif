'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Editor } from '@/components/editor'
import { ImageUpload } from '@/components/image-upload'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

function calculateReadTime(text: string) {
  const wordsPerMinute = 200;
  const noOfWords = text.split(/\s/g).length;
  const minutes = noOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return readTime;
}

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [body, setBody] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [status, setStatus] = useState('Draft')
  const [visibility, setVisibility] = useState('Public')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchBlog() {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        alert('Blog not found')
        router.push('/dashboard/blogs')
        return
      }

      if (data) {
        setTitle(data.title || '')
        setSummary(data.summary || '')
        setBody(data.body || '')
        setImageUrl(data.image_url || '')
        setStatus(data.status || 'Draft')
        setVisibility(data.visibility || 'Public')
      }
      setIsLoading(false)
    }

    fetchBlog()
  }, [id, router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('You must be logged in to edit a blog.')
      setIsSubmitting(false)
      return
    }

    const textOnly = body.replace(/<[^>]*>?/gm, '')
    const readTime = calculateReadTime(textOnly)

    const { error } = await supabase
      .from('blogs')
      .update({
        title,
        summary,
        body,
        image_url: imageUrl,
        status,
        visibility,
        read_time: readTime,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)

    setIsSubmitting(false)

    if (error) {
      alert(`Error updating blog: ${error.message}`)
    } else {
      router.push('/dashboard/blogs')
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return
    
    setIsSubmitting(true)
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)

    if (error) {
      alert(`Error deleting blog: ${error.message}`)
      setIsSubmitting(false)
    } else {
      router.push('/dashboard/blogs')
      router.refresh()
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-12">Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Blog</h1>
          <p className="text-muted-foreground">
            Update your blog post.
          </p>
        </div>
        <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
          Delete Blog
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog post title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="A brief summary of your blog post"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Cover Image</Label>
          <ImageUpload value={imageUrl} onChange={setImageUrl} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v) => v && setStatus(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="visibility">Visibility</Label>
          <Select value={visibility} onValueChange={(v) => v && setVisibility(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Public">Public (Anyone can view)</SelectItem>
              <SelectItem value="Private">Private (Only you can view)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <Editor content={body} onChange={setBody} />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Update Blog'}
          </Button>
        </div>
      </form>
    </div>
  )
}
