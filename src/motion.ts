import type { Transition } from 'framer-motion';

export const EASE = [0.4, 0, 0.2, 1] as const;

// Shared scroll-reveal settings. The positive bottom margin extends the
// observer root below the viewport, so reveals start shortly before an
// element scrolls in and content never sits blank while visible.
export const viewportOnce = { once: true, margin: '0px 0px 15% 0px' } as const;

// A single tween keeps opacity and transform in step; the default per-value
// springs can finish at different times under main-thread load, which reads
// as flicker. Stagger delays are capped so no card waits while in view.
export const reveal = (delay = 0): Transition => ({
  duration: 0.55,
  ease: EASE,
  delay: Math.min(delay, 0.15),
});
