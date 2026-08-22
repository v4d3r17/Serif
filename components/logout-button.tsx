'use client'

import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/client'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <SidebarMenuButton onClick={logout} className="w-full text-muted-foreground hover:text-foreground">
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </SidebarMenuButton>
  )
}
