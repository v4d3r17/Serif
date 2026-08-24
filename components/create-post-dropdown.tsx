'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Plus, Sparkles, PenLine } from 'lucide-react'
import { toast } from 'sonner'

export function CreatePostDropdown() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a topic or prompt for the AI.')
      return
    }
    
    setIsGenerating(true)
    try {
      const res = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to generate blog post')
      }

      const data = await res.json()
      
      toast.success('Blog post generated successfully!')
      setIsDialogOpen(false)
      setPrompt('')
      
      // Redirect to the editor to review the generated post
      if (data.id) {
        router.push(`/dashboard/blogs/${data.id}/edit`)
      } else {
        router.refresh()
      }
    } catch (error: unknown) {
      console.error(error)
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button className="rounded-full px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-none font-medium h-9 text-sm flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        } />
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem 
            className="cursor-pointer font-medium p-3"
            onClick={() => router.push('/dashboard/blogs/new')}
          >
            <div className="flex items-center gap-2 w-full">
              <PenLine className="h-4 w-4 text-muted-foreground" />
              Create Manually
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer font-medium p-3 focus:bg-blue-50 focus:text-blue-600 dark:focus:bg-blue-950 dark:focus:text-blue-400"
            onClick={() => setIsDialogOpen(true)}
          >
            <div className="flex items-center gap-2 w-full">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Generate with AI
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Generate with AI
            </DialogTitle>
            <DialogDescription>
              Describe what you want your blog post to be about. The AI will generate a complete post including title, summary, and formatted body.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              id="prompt"
              placeholder="e.g. Write a comprehensive guide on the future of AI agents in software engineering..."
              className="col-span-3 min-h-[120px] resize-none focus-visible:ring-blue-500"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Post'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
