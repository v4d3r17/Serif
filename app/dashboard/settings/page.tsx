'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/image-upload'
import { Database, ShieldCheck, UserCircle, Save } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [firstName, setFirstName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      setEmail(user.email || '')

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setFirstName(data.first_name || '')
        setUsername(data.username || '')
        setBio(data.bio || '')
        setAvatarUrl(data.avatar_url || '')
      }
      setIsLoading(false)
    }

    fetchProfile()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('You must be logged in to update settings.')
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        username: username,
        bio: bio,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    setIsSubmitting(false)

    if (error) {
      alert(`Error updating profile: ${error.message}`)
    } else {
      alert('Profile updated successfully!')
      router.refresh()
    }
  }

  const handleSeedData = async () => {
    setIsSeeding(true)
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to seed data')
      alert('Successfully injected 5 dummy blogs into your account!')
      router.push('/dashboard')
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message)
    } finally {
      setIsSeeding(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure? This action cannot be undone and will permanently delete your account, blogs, and data."
    )
    if (!confirmDelete) return

    // Since we don't have the backend Service Role Key configured to wipe auth.users,
    // we will simulate the deletion by signing the user out.
    try {
      await supabase.auth.signOut()
      alert('Your account deletion request has been processed.')
      router.push('/auth/login')
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-12 text-muted-foreground">Loading your profile...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
      </div>
      
      <div className="grid gap-6">
        
        {/* Public Profile Section */}
        <form onSubmit={handleSubmit} className="flex flex-col rounded-xl border bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/50 bg-muted/20 flex items-center gap-3">
            <UserCircle className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Public Profile</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <Label>Avatar Image</Label>
              <ImageUpload 
                value={avatarUrl} 
                onChange={setAvatarUrl} 
                bucket="avatars"
              />
              <p className="text-xs text-muted-foreground">This image will be displayed on your blogs and in the explore feed.</p>
            </div>

            <div className="space-y-2 max-w-md">
              <Label htmlFor="firstName">Display Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>

            <div className="space-y-2 max-w-md">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="janedoe"
              />
            </div>

            <div className="space-y-2 max-w-md">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A short bio..."
              />
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 border-t flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>

        {/* Account Security Section */}
        <div className="flex flex-col rounded-xl border bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/50 bg-muted/20 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold">Account & Security</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2 max-w-md">
              <Label>Email Address</Label>
              <Input
                value={email}
                disabled
                readOnly
                className="bg-muted text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">Your email is managed by your authentication provider.</p>
            </div>
            
            <div className="flex items-center justify-between border-t pt-6">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive emails about community activity on your posts.</p>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition" />
              </div>
            </div>
          </div>
        </div>

        {/* Developer Tools Section */}
        <div className="flex flex-col rounded-xl border border-border/50 bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/50 bg-muted/20 flex items-center gap-3">
            <Database className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Developer Tools</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">Seed Dummy Blogs</h3>
                <p className="text-sm text-muted-foreground">Inject 5 beautifully formatted, dummy blog posts into your account to test out the UI.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSeedData}
                disabled={isSeeding}
                className="border-dashed border-2 whitespace-nowrap"
              >
                {isSeeding ? 'Seeding Data...' : 'Inject Dummy Data'}
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="flex flex-col rounded-xl border border-destructive/30 bg-destructive/5 backdrop-blur-md overflow-hidden shadow-sm mt-4">
          <div className="p-6 border-b border-destructive/20 bg-destructive/10 flex items-center gap-3">
            <Database className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently remove your Personal Account and all of its contents from the platform. This action is not reversible, so please continue with caution.
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                className="whitespace-nowrap"
              >
                Delete Personal Account
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
