import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
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
      
      <header className="px-4 md:px-20 py-4 md:py-6 border-b bg-background/50 backdrop-blur-md z-10">
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
              <Link href="/auth/sign-up" className="text-sm md:text-base font-medium bg-foreground text-background px-4 py-2 md:px-6 md:py-2.5 rounded-md hover:opacity-90 transition-opacity whitespace-nowrap">
                Sign up
              </Link>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-balance">
          Supercharge your writing with AI.
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
          Serif is an intelligent blogging platform that uses AI to help you draft, refine, and publish your thoughts beautifully. Write faster, edit smarter.
        </p>
        <Link href="/auth/sign-up" className="bg-foreground text-background px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg">
          Start Writing Today
        </Link>
      </main>

      <footer className="py-6 text-center border-t bg-background/80 backdrop-blur-md text-sm text-muted-foreground z-10">
        &copy; {new Date().getFullYear()} Serif. All rights reserved.
      </footer>
    </div>
  );
}
