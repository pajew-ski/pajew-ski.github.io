import type { Transition } from 'framer-motion';

// Shared scroll-reveal timing for every card grid and section element.
// One easing and one duration across the site keep the entrance calm and
// uniform. Only opacity and transform are animated (both compositor-friendly),
// so the reveal never fights a CSS transition on the same element.

export const revealEase = [0.16, 1, 0.3, 1] as const; // easeOutExpo, matches Intro

export const revealDuration = 0.5;

// Trigger a touch after the element edge enters, and only once. A small amount
// avoids the "already visible, then animates" flicker on fast scrolls.
export const revealViewport = { once: true, amount: 0.15 } as const;

export const revealTransition: Transition = {
  duration: revealDuration,
  ease: revealEase,
};

// Staggered variant for grids: a gentle, capped delay so a row of cards reads
// as one motion instead of popcorn. Capped so long lists never lag.
export function revealDelay(index: number, step = 0.05, max = 0.25): Transition {
  return { duration: revealDuration, ease: revealEase, delay: Math.min(index * step, max) };
}
