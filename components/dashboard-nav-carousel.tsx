'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Home, FileText, Compass, Bookmark, Settings } from 'lucide-react';
import { useMemo, useCallback, useRef, useEffect, useState } from 'react';

const NAV_ITEMS = [
  { title: 'Home',     url: '/dashboard',          icon: Home     },
  { title: 'Blogs',    url: '/dashboard/blogs',     icon: FileText },
  { title: 'Explore',  url: '/dashboard/explore',   icon: Compass  },
  { title: 'Saved',    url: '/dashboard/saved',     icon: Bookmark },
  { title: 'Settings', url: '/dashboard/settings',  icon: Settings },
] as const;

const COUNT = NAV_ITEMS.length;

/* ── per-slot visual config ────────────────────────────────── */
function getSlotStyle(dist: number) {
  const abs = Math.abs(dist);
  if (abs === 0) return { scale: 1.0,  opacity: 1.0  };
  if (abs === 1) return { scale: 0.72, opacity: 0.38 };
  return                { scale: 0.55, opacity: 0.15 };
}

/* ── spring configs ────────────────────────────────────────── */
const SLIDE_SPRING = { type: 'spring' as const, stiffness: 140, damping: 22, mass: 1.1 };
const ICON_SPRING  = { type: 'spring' as const, stiffness: 300, damping: 28, mass: 0.7 };

export function DashboardNavCarousel() {
  const pathname = usePathname();
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const [offsetX, setOffsetX] = useState(0);
  const navigateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* route-based active index */
  const routeIndex = useMemo(() => {
    const exact = NAV_ITEMS.findIndex((item) => item.url === pathname);
    if (exact !== -1) return exact;
    const prefix = NAV_ITEMS.findIndex(
      (item) => item.url !== '/dashboard' && pathname.startsWith(item.url)
    );
    return prefix !== -1 ? prefix : 0;
  }, [pathname]);

  /*
   * "visual" active index — drives the carousel animation.
   * Updated immediately on click (before navigation), so the slide
   * animation plays first, then the page navigates after a delay.
   */
  const [visualIndex, setVisualIndex] = useState(routeIndex);

  /* sync visual index when route changes externally (back/forward) */
  useEffect(() => {
    setVisualIndex(routeIndex);
  }, [routeIndex]);

  /* cleanup pending navigations on unmount */
  useEffect(() => {
    return () => {
      if (navigateTimer.current) clearTimeout(navigateTimer.current);
    };
  }, []);

  /*
   * Circular slot order: active item always in center,
   * items wrap around both sides.
   */
  const slots = useMemo(() => {
    const half = Math.floor(COUNT / 2);
    const result: { item: typeof NAV_ITEMS[number]; dataIndex: number; dist: number }[] = [];
    for (let offset = -half; offset <= half; offset++) {
      const idx = ((visualIndex + offset) % COUNT + COUNT) % COUNT;
      result.push({ item: NAV_ITEMS[idx], dataIndex: idx, dist: offset });
    }
    return result;
  }, [visualIndex]);

  /* compute translateX to keep center slot centered */
  useEffect(() => {
    const recalc = () => {
      const track = trackRef.current;
      if (!track) return;
      const centerSlot = Math.floor(COUNT / 2);
      const card = track.children[centerSlot] as HTMLElement | undefined;
      if (!card) return;
      const trackW = track.scrollWidth;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      setOffsetX(trackW / 2 - cardCenter);
    };

    const raf = requestAnimationFrame(recalc);
    const ro = new ResizeObserver(recalc);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [visualIndex]);

  const handleClick = useCallback(
    (url: string, targetIndex: number) => {
      if (targetIndex === visualIndex) return;

      // Cancel any pending navigation
      if (navigateTimer.current) clearTimeout(navigateTimer.current);

      // 1) Immediately animate the carousel to the new position
      setVisualIndex(targetIndex);

      // 2) Navigate immediately instead of waiting for the animation
      router.push(url);
    },
    [router, visualIndex]
  );

  return (
    <div className="dash-carousel">
      <motion.div
        ref={trackRef}
        className="dash-carousel__track"
        animate={{ x: offsetX }}
        transition={SLIDE_SPRING}
      >
        {slots.map(({ item, dataIndex, dist }) => {
          const slot = getSlotStyle(dist);
          const isActive = dist === 0;
          const Icon = item.icon;

          return (
            <motion.button
              key={`${item.url}-${dataIndex}`}
              type="button"
              onClick={() => handleClick(item.url, dataIndex)}
              className={`dash-carousel__card${isActive ? ' is-active' : ''}`}
              animate={{
                scale: slot.scale,
                opacity: slot.opacity,
              }}
              transition={ICON_SPRING}
              whileHover={
                isActive
                  ? { scale: 1.12 }
                  : { scale: slot.scale * 1.15, opacity: Math.min(slot.opacity + 0.2, 0.7) }
              }
              whileTap={{ scale: isActive ? 0.92 : slot.scale * 0.88 }}
              aria-label={item.title}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="dash-carousel__icon" strokeWidth={isActive ? 2 : 1.5} />
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
