'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

export async function toggleLike(blogId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Check if already liked
  const { data: existing } = await supabase
    .from('blog_likes')
    .select('id')
    .eq('blog_id', blogId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await supabase.from('blog_likes').delete().eq('id', existing.id)
  } else {
    await supabase.from('blog_likes').insert({ blog_id: blogId, user_id: user.id })
  }

  revalidatePath('/dashboard/explore')
  revalidatePath('/dashboard/saved')
  return { success: true }
}

export async function toggleSave(blogId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Check if already saved
  const { data: existing } = await supabase
    .from('blog_saves')
    .select('id')
    .eq('blog_id', blogId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await supabase.from('blog_saves').delete().eq('id', existing.id)
  } else {
    await supabase.from('blog_saves').insert({ blog_id: blogId, user_id: user.id })
  }

  revalidatePath('/dashboard/explore')
  revalidatePath('/dashboard/saved')
  return { success: true }
}
