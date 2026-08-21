'use client'

import { useState } from 'react'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath)
      
      onChange(data.publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div className={cn("space-y-4 w-full", className)}>
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-md border">
          <Image
            fill
            src={value}
            alt="Upload"
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center rounded-md border border-dashed p-10 hover:bg-muted/50 transition-colors">
          <Input
            type="file"
            accept="image/*"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={handleUpload}
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 animate-spin mb-2" />
                <p>Uploading...</p>
              </>
            ) : (
              <>
                <UploadCloud className="h-10 w-10 mb-2" />
                <p>Click or drag to upload an image</p>
                <p className="text-xs mt-1">SVG, PNG, JPG or GIF</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
