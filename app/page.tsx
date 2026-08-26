import Link from "next/link";
import Image from "next/image";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/fade-in";
import { CinematicBg } from "@/components/cinematic-bg";

export default function Page() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Cinematic Multi-Layer Landscape Background with Entrance Animation */}
      <CinematicBg
        src="/background.png"
        alt="Background"
        className="absolute inset-0 -z-10"
      />
      
      {/* Header — gently emerges at 2.0s after landscape begins to settle */}
      <header className="px-4 md:px-20 py-4 md:py-6 border-b bg-background/50 backdrop-blur-md z-10">
        <FadeIn yOffset={-14} delay={2.0} duration={0.8}>
          <div className="w-full flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Serif Logo" width={140} height={140} className="w-auto h-[40px] md:h-[60px] object-contain" />
            </Link>
            <nav className="flex items-center gap-6 md:gap-12 lg:gap-16">
              <div className="hidden md:flex gap-10">
                <Link href="#features" className="text-base font-medium hover:text-foreground/80 transition-colors">
                  Features
                </Link>
                <Link href="/blogs" className="text-base font-medium hover:text-foreground/80 transition-colors">
                  Blog
                </Link>
                <Link href="#pricing" className="text-base font-medium hover:text-foreground/80 transition-colors">
                  Pricing
                </Link>
              </div>
              <div className="flex items-center gap-4 md:gap-8">
                <Link href="/auth/login" className="text-sm md:text-base font-medium hover:underline underline-offset-4">
                  Log in
                </Link>
                <Link href="/auth/sign-up" className="serif-btn-3d text-sm md:text-base font-medium bg-foreground text-background px-4 py-2 md:px-6 md:py-2.5 rounded-md whitespace-nowrap">
                  Sign up
                </Link>
              </div>
            </nav>
          </div>
        </FadeIn>
      </header>
      
      {/* Hero Content — choreographed entrance from within the formed landscape */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 z-10">
        <StaggerContainer staggerChildren={0.2} delayChildren={2.2}>
          <StaggerItem>
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-muted-foreground/80 font-medium mb-3">
              Intelligent Editorial Craft
            </span>
          </StaggerItem>

          <StaggerItem>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-balance">
              Supercharge your writing with AI.
            </h1>
          </StaggerItem>
          
          <StaggerItem>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
              Serif is an intelligent blogging platform that uses AI to help you draft, refine, and publish your thoughts beautifully. Write faster, edit smarter.
            </p>
          </StaggerItem>
          
          <StaggerItem>
            <Link href="/auth/sign-up" className="serif-btn-3d inline-block bg-foreground text-background px-8 py-4 rounded-full font-semibold text-lg shadow-lg">
              Start Writing Today
            </Link>
          </StaggerItem>
        </StaggerContainer>
      </main>

      {/* Footer — smoothly fades in after hero content */}
      <FadeIn yOffset={15} delay={3.2} duration={0.8}>
        <footer className="py-6 text-center border-t bg-background/80 backdrop-blur-md text-sm text-muted-foreground z-10">
          &copy; {new Date().getFullYear()} Serif. All rights reserved.
        </footer>
      </FadeIn>
    </div>
  );
}
