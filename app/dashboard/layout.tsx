import Image from "next/image"
import Link from "next/link"
import { ParallaxBg } from "@/components/ui/parallax-bg"
import { DashboardNavCarousel } from "@/components/dashboard-nav-carousel"
import { DashboardMobileNav } from "@/components/dashboard-mobile-nav"
import { LogoutButton } from "@/components/logout-button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col w-full overflow-hidden">
      {/* Background Image Container — parallax */}
      <ParallaxBg
        src="/background.png"
        alt="Background"
        shift={10}
        className="absolute inset-0 -z-10"
      />

      {/* Top Header: On desktop has carousel, on mobile/tablet shows Logo + Logout */}
      <header className="flex items-center justify-between gap-4 border-b bg-background/50 backdrop-blur-md px-4 py-2.5 transition-shadow duration-300 hover:shadow-sm z-20">
        {/* Left: Logo */}
        <Link href="/dashboard" className="flex items-center flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Serif Logo"
            width={120}
            height={120}
            className="w-auto h-7 md:h-8 object-contain"
          />
        </Link>

        {/* Center: Carousel Navbar (Desktop / large screens) */}
        <div className="hidden lg:flex flex-1 items-center justify-center overflow-visible">
          <DashboardNavCarousel />
        </div>

        {/* Right: Logout button */}
        <div className="flex-shrink-0">
          <LogoutButton />
        </div>
      </header>

      {/* Main Content: padded at bottom on mobile/tablet for bottom nav */}
      <main className="flex-1 overflow-auto p-4 md:p-6 pb-24 lg:pb-6 z-10">
        {children}
      </main>

      {/* Mobile & Tablet Instagram-Style Bottom Navigation Bar (Icons Only) */}
      <DashboardMobileNav />
    </div>
  )
}
