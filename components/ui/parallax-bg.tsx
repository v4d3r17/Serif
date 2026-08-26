'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';

interface ParallaxBgProps {
  src: string;
  alt: string;
  /** Parallax shift in pixels (default 20) */
  shift?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

/**
 * Drop-in replacement for a background <Image> container.
 * Adds a subtle vertical parallax (10–20px) without changing
 * the image, opacity, or container dimensions.
 */
export function ParallaxBg({
  src,
  alt,
  shift = 20,
  className,
  imageClassName = 'object-cover opacity-80',
  priority = true,
}: ParallaxBgProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Move from +shift to -shift as user scrolls
  const y = useTransform(scrollYProgress, [0, 1], [shift, -shift]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          className={imageClassName}
          priority={priority}
        />
      </motion.div>
    </div>
  );
}
