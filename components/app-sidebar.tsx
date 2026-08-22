import { Home, FileText, Settings, LogOut, Compass, Bookmark } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { LogoutButton } from "@/components/logout-button"
import { SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Blogs",
    url: "/dashboard/blogs",
    icon: FileText,
  },
  {
    title: "Explore",
    url: "/dashboard/explore",
    icon: Compass,
  },
  {
    title: "Saved",
    url: "/dashboard/saved",
    icon: Bookmark,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <Link href="/dashboard" className="flex items-center">
          <Image src="/logo.png" alt="Serif Logo" width={140} height={140} className="w-auto h-8 object-contain" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
