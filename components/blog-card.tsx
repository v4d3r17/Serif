'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Bookmark } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toggleLike, toggleSave } from '@/app/dashboard/actions'

interface BlogCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blog: any;
  authorName: string;
  authorAvatar: string;
  initialLiked: boolean;
  initialSaved: boolean;
  likeCount: number;
}

export function BlogCard({ blog, authorName, authorAvatar, initialLiked, initialSaved, likeCount }: BlogCardProps) {
  const [isPending, startTransition] = useTransition()
  const [liked, setLiked] = useState(initialLiked)
  const [saved, setSaved] = useState(initialSaved)
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(likeCount)

  const handleLike = () => {
    setLiked(!liked)
    setOptimisticLikeCount(prev => liked ? prev - 1 : prev + 1)
    startTransition(async () => {
      await toggleLike(blog.id)
    })
  }

  const handleSave = () => {
    setSaved(!saved)
    startTransition(async () => {
      await toggleSave(blog.id)
    })
  }

  return (
    <div className="serif-card-3d relative flex flex-col rounded-xl border bg-card/60 backdrop-blur-md overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      
      {/* Absolute link to make the entire card clickable */}
      <Link href={`/blogs/${blog.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {blog.title}</span>
      </Link>

      {/* Blog Image */}
      <div className="relative h-48 w-full overflow-hidden block">
        {blog.image_url ? (
          <Image 
            src={blog.image_url} 
            alt={blog.title} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground transition-transform duration-500 group-hover:scale-105">
            No Image
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Author info & Read time */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {authorAvatar ? (
              <Image src={authorAvatar} alt={authorName} width={24} height={24} className="rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-medium text-muted-foreground">{authorName}</span>
          </div>
          <span className="text-xs text-muted-foreground">{blog.read_time} min read</span>
        </div>

        {/* Title and Summary */}
        <div className="flex-1">
          <h3 className="font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2 relative z-20 pointer-events-none">
            {blog.summary || "No summary provided."}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-2 border-t mt-auto relative z-20">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-1.5 hover:bg-transparent transition-transform duration-200 hover:scale-110 ${liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            <span className="text-xs font-medium">{optimisticLikeCount}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            className={`hover:bg-transparent transition-transform duration-200 hover:scale-110 ${saved ? 'text-blue-600 hover:text-blue-700' : 'text-muted-foreground'}`}
            onClick={handleSave}
          >
            <Bookmark className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  )
}
