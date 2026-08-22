import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="relative min-h-screen flex w-full overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 -z-10">
          <Image 
            src="/background.png" 
            alt="Background" 
            fill 
            className="object-cover opacity-80" 
            priority
          />
        </div>

        <AppSidebar />
        <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out relative z-10">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/50 backdrop-blur-md px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6 z-10">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
