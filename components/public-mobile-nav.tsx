'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Home, Compass, Sparkles, LogIn } from 'lucide-react';

const PUBLIC_NAV_ITEMS = [
  { title: 'Home',     url: '/',             icon: Home     },
  { title: 'Blogs',    url: '/blogs',        icon: Compass  },
  { title: 'Features', url: '/#features',    icon: Sparkles },
  { title: 'Log in',   url: '/auth/login',    icon: LogIn    },
] as const;

export function PublicMobileNav() {
  const pathname = usePathname();

  // Do not show on auth or dashboard pages
  if (pathname.startsWith('/auth') || pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-background/85 backdrop-blur-xl border-t border-border/50 shadow-lg px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      aria-label="Public Mobile Navigation"
    >
      <div className="max-w-xs mx-auto flex items-center justify-around">
        {PUBLIC_NAV_ITEMS.map((item) => {
          const isActive =
            item.url === '/' ? pathname === '/' : pathname === item.url;
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.url}
              className={`relative flex flex-col items-center justify-center p-2.5 rounded-full transition-colors ${
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground/70 hover:text-foreground active:scale-95'
              }`}
              aria-label={item.title}
              aria-current={isActive ? 'page' : undefined}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 0.95,
                  y: isActive ? -1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="relative flex items-center justify-center"
              >
                <Icon
                  className="w-5 h-5 transition-all duration-200"
                  strokeWidth={isActive ? 2.2 : 1.6}
                />
              </motion.div>

              {/* Instagram-style active dot indicator */}
              {isActive && (
                <motion.span
                  layoutId="public-mobile-nav-active-dot"
                  className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-foreground"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
