'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface CinematicBgProps {
  src?: string;
  alt?: string;
  className?: string;
  onAnimationComplete?: () => void;
}

export function CinematicBg({
  src = '/background.png',
  alt = 'Landscape Background',
  className = '',
  onAnimationComplete,
}: CinematicBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseAtmosphereRef = useRef<HTMLDivElement>(null);
  const distantMtnsRef = useRef<HTMLDivElement>(null);
  const midMtnsRef = useRef<HTMLDivElement>(null);
  const foreMtnsRef = useRef<HTMLDivElement>(null);
  const branchesRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);
  const ambientTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const layers = [
      baseAtmosphereRef.current,
      distantMtnsRef.current,
      midMtnsRef.current,
      foreMtnsRef.current,
      branchesRef.current,
      mistRef.current,
    ];

    if (!containerRef.current || layers.some((l) => !l)) return;

    if (isReducedMotion) {
      // Instant set for accessibility
      gsap.set(layers, { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' });
      onAnimationComplete?.();
      return;
    }

    // Initial setup before entrance starts (0.0s)
    gsap.set(baseAtmosphereRef.current, { opacity: 0 });
    gsap.set(distantMtnsRef.current, {
      opacity: 0,
      y: 40,
      filter: 'blur(8px)',
      scale: 1.02,
    });
    gsap.set(midMtnsRef.current, {
      opacity: 0,
      y: 60,
      scale: 1.05,
      filter: 'blur(4px)',
    });
    gsap.set(foreMtnsRef.current, {
      opacity: 0,
      y: 85,
      scale: 1.08,
    });
    gsap.set(branchesRef.current, {
      opacity: 0,
      x: 50,
      y: 35,
      scale: 0.95,
      rotate: 1.5,
      transformOrigin: 'top right',
    });
    gsap.set(mistRef.current, {
      opacity: 0,
      scale: 1.15,
      x: -30,
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onAnimationComplete?.();
          // Start ambient breathing motion on branches and mist
          ambientTweenRef.current = gsap.to(branchesRef.current, {
            rotate: -0.8,
            y: '-=4',
            x: '+=3',
            duration: 5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });

          gsap.to(mistRef.current, {
            x: '+=25',
            opacity: 0.45,
            duration: 8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
        },
      });

      // 0.0s - 0.8s: Base sky & atmospheric warmth fades in
      tl.to(baseAtmosphereRef.current, {
        opacity: 0.9,
        duration: 0.9,
        ease: 'power2.inOut',
      }, 0.0);

      // 0.2s - 1.2s: Distant Mountains begin forming (soft rise, de-blur)
      tl.to(distantMtnsRef.current, {
        opacity: 0.9,
        y: 0,
        scale: 1.0,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power2.out',
      }, 0.2);

      // 0.6s - 1.8s: Midground Mountains rise with stronger presence
      tl.to(midMtnsRef.current, {
        opacity: 0.95,
        y: 0,
        scale: 1.0,
        filter: 'blur(0px)',
        duration: 1.3,
        ease: 'power3.out',
      }, 0.6);

      // 1.0s - 2.2s: Foreground Mountains & ground plane settle
      tl.to(foreMtnsRef.current, {
        opacity: 1.0,
        y: 0,
        scale: 1.0,
        duration: 1.4,
        ease: 'power3.out',
      }, 1.0);

      // 1.2s - 2.5s: Right-Side Branches & Botanical Shadows extend into frame like a gentle breeze
      tl.to(branchesRef.current, {
        opacity: 0.85,
        x: 0,
        y: 0,
        scale: 1.0,
        rotate: 0,
        duration: 1.4,
        ease: 'power2.out',
      }, 1.2);

      // 1.8s - 2.8s: Atmospheric mist & luminous haze settles across layers
      tl.to(mistRef.current, {
        opacity: 0.6,
        scale: 1.0,
        x: 0,
        duration: 1.2,
        ease: 'sine.out',
      }, 1.8);

      // Interactive subtle mouse parallax
      const handlePointerMove = (e: PointerEvent) => {
        const { innerWidth, innerHeight } = window;
        const normX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
        const normY = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

        // Distant mountains (slowest, 4px)
        gsap.to(distantMtnsRef.current, {
          x: normX * 4,
          y: normY * 3,
          duration: 1.5,
          ease: 'power1.out',
          overwrite: 'auto',
        });

        // Midground mountains (moderate, 9px)
        gsap.to(midMtnsRef.current, {
          x: normX * 9,
          y: normY * 6,
          duration: 1.2,
          ease: 'power1.out',
          overwrite: 'auto',
        });

        // Foreground mountain ridge & ground (closer, 16px)
        gsap.to(foreMtnsRef.current, {
          x: normX * 16,
          y: normY * 10,
          duration: 1.0,
          ease: 'power1.out',
          overwrite: 'auto',
        });

        // Botanical shadows / branches on the right (organic sway, 12px)
        gsap.to(branchesRef.current, {
          x: -normX * 12,
          y: -normY * 8,
          rotate: normX * 0.6,
          duration: 1.4,
          ease: 'power1.out',
          overwrite: 'auto',
        });

        // Mist overlay (floating drift, 20px)
        gsap.to(mistRef.current, {
          x: normX * 22,
          y: normY * 14,
          duration: 2.0,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      };

      window.addEventListener('pointermove', handlePointerMove, { passive: true });

      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
      };
    }, containerRef);

    return () => {
      ctx.revert();
      ambientTweenRef.current?.kill();
    };
  }, [onAnimationComplete]);

  return (
    <div
      ref={containerRef}
      className={`cinematic-bg-container pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* ── Layer 0: Warm Base Atmosphere & Top-Left Sunbeams ── */}
      <div
        ref={baseAtmosphereRef}
        className="cinematic-layer absolute inset-0 z-0"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 70% at 30% 20%, black 40%, rgba(0,0,0,0.6) 80%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 30% 20%, black 40%, rgba(0,0,0,0.6) 80%, transparent 100%)',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[1.02]"
        />
      </div>

      {/* ── Layer 1: Distant Mountains (Left-Center horizon) ── */}
      <div
        ref={distantMtnsRef}
        className="cinematic-layer absolute inset-0 z-1"
        style={{
          maskImage: 'radial-gradient(ellipse 65% 50% at 24% 60%, black 25%, rgba(0,0,0,0.5) 60%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 50% at 24% 60%, black 25%, rgba(0,0,0,0.5) 60%, transparent 85%)',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[1.01] contrast-[0.98]"
        />
      </div>

      {/* ── Layer 2: Midground Mountains (Left slope ridges) ── */}
      <div
        ref={midMtnsRef}
        className="cinematic-layer absolute inset-0 z-2"
        style={{
          maskImage: 'radial-gradient(ellipse 55% 45% at 16% 68%, black 35%, rgba(0,0,0,0.6) 65%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 55% 45% at 16% 68%, black 35%, rgba(0,0,0,0.6) 65%, transparent 90%)',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center contrast-[1.04]"
        />
      </div>

      {/* ── Layer 3: Foreground Mountain Peak & Ground Plane ── */}
      <div
        ref={foreMtnsRef}
        className="cinematic-layer absolute inset-0 z-3"
        style={{
          maskImage: 'linear-gradient(to top, black 25%, rgba(0,0,0,0.9) 45%, rgba(0,0,0,0.5) 65%, transparent 85%), radial-gradient(ellipse 40% 50% at 6% 75%, black 40%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to top, black 25%, rgba(0,0,0,0.9) 45%, rgba(0,0,0,0.5) 65%, transparent 85%), radial-gradient(ellipse 40% 50% at 6% 75%, black 40%, transparent 85%)',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center contrast-[1.06] brightness-[0.99]"
        />
      </div>

      {/* ── Layer 4: Right-Side Botanical Branches & Tree Shadows ── */}
      <div
        ref={branchesRef}
        className="cinematic-layer absolute inset-0 z-4"
        style={{
          maskImage: 'radial-gradient(ellipse 65% 75% at 85% 35%, black 35%, rgba(0,0,0,0.7) 70%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 75% at 85% 35%, black 35%, rgba(0,0,0,0.7) 70%, transparent 95%)',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center contrast-[1.08] saturate-[1.02]"
        />
      </div>

      {/* ── Layer 5: Luminous Atmospheric Mist Drift ── */}
      <div
        ref={mistRef}
        className="cinematic-layer absolute inset-0 z-5 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 45% at 35% 70%, rgba(247, 243, 235, 0.45) 0%, rgba(243, 237, 226, 0.2) 45%, transparent 75%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* ── Fallback Master Base Image (rendered at baseline opacity for seamless unity) ── */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
