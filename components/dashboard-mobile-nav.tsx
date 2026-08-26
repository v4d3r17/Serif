'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Compass, Bookmark, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { title: 'Home',     url: '/dashboard',          icon: Home     },
  { title: 'Blogs',    url: '/dashboard/blogs',     icon: FileText },
  { title: 'Explore',  url: '/dashboard/explore',   icon: Compass  },
  { title: 'Saved',    url: '/dashboard/saved',     icon: Bookmark },
  { title: 'Settings', url: '/dashboard/settings',  icon: Settings },
] as const;

export function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-background/90 backdrop-blur-2xl border-t border-border/40 shadow-xl px-4 py-2 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
      aria-label="Dashboard Mobile Navigation"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.url === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.url);
          const Icon = item.icon;

          return (
            <Link
              key={item.url}
              href={item.url}
              className={`relative flex flex-col items-center justify-center p-2.5 rounded-full transition-all duration-200 ${
                isActive
                  ? 'text-foreground scale-110'
                  : 'text-muted-foreground/60 hover:text-foreground active:scale-90'
              }`}
              aria-label={item.title}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-6 h-6 transition-all duration-200 ${
                  isActive ? 'stroke-[2.25]' : 'stroke-[1.6]'
                }`}
              />

              {/* Instagram-style active indicator dot */}
              {isActive && (
                <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-foreground transition-transform duration-200 scale-100" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
