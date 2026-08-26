'use client';

import React from 'react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/fade-in';

/**
 * Thin client wrapper that adds scroll-reveal animations
 * to dashboard sections. Does NOT alter layout or styling.
 */
export function DashboardHeading({ children }: { children: React.ReactNode }) {
  return (
    <FadeIn yOffset={15} duration={0.5}>
      {children}
    </FadeIn>
  );
}

export function DashboardMetricsGrid({ children }: { children: React.ReactNode }) {
  return (
    <StaggerContainer staggerChildren={0.08} className="grid gap-4 md:grid-cols-3">
      {children}
    </StaggerContainer>
  );
}

export function DashboardMetricCard({ children }: { children: React.ReactNode }) {
  return (
    <StaggerItem>
      {children}
    </StaggerItem>
  );
}

export function DashboardSection({ children, delay = 0.15 }: { children: React.ReactNode; delay?: number }) {
  return (
    <FadeIn yOffset={15} delay={delay} duration={0.5}>
      {children}
    </FadeIn>
  );
}
