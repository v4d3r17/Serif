import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <div className="font-bold text-2xl tracking-tighter">Serif</div>
        <nav className="flex gap-4">
          <Link href="/auth/login" className="text-sm font-medium hover:underline underline-offset-4 px-4 py-2">
            Log in
          </Link>
          <Link href="/auth/signup" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
            Sign up
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Write without distractions.
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Serif is a minimal, focused blogging platform designed to help you share your thoughts with the world in a beautiful way.
        </p>
        <Link href="/auth/signup" className="bg-foreground text-background px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity">
          Start Writing Today
        </Link>
      </main>

      <footer className="py-6 text-center border-t text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Serif. All rights reserved.
      </footer>
    </div>
  );
}
