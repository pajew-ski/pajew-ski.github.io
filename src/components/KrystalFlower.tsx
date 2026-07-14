import { motion } from 'framer-motion';

const CX = 250;
const CY = 250;
const R = 200;
const r0 = R / 64;

function generateSpiralPath(baseAngle: number, dir: number): string {
  const TURNS = 1.5;
  // A logarithmic spiral never reaches r = 0; extending it half a turn below
  // r0 shrinks the start radius to r0/4 (sub-pixel), closing the centre hole.
  const INNER_TURNS = 0.5;
  const STEPS = 480;
  const parts: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const theta = (-INNER_TURNS + (i / STEPS) * (TURNS + INNER_TURNS)) * 2 * Math.PI;
    const r = r0 * Math.pow(2, (2 * theta) / Math.PI);
    const angle = baseAngle + dir * theta;
    const x = CX + r * Math.cos(angle);
    const y = CY + r * Math.sin(angle);
    parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return parts.join(' ');
}

const SPIRALS: { path: string; dir: 1 | -1 }[] = Array.from({ length: 12 }, (_, k) => {
  const base = -Math.PI / 2 + k * (Math.PI / 6);
  return [
    { path: generateSpiralPath(base, +1), dir: 1 as const },
    { path: generateSpiralPath(base, -1), dir: -1 as const },
  ];
}).flat();

const EASE = [0.4, 0, 0.2, 1] as const;
const DRAW_DURATION = 3.4;
const CLIP_ID = 'krystal-flower-reveal';

interface KrystalFlowerProps {
  animated?: boolean;
  delay?: number;
  className?: string;
}

// 24 logarithmic spirals (12 per direction), nothing else. The flower is
// revealed by a circular clip growing from the centre instead of stroke-dash
// drawing (motion's pathLength): iOS Safari mis-renders animated dasharray on
// these long polyline paths. Radius grows monotonically along a log spiral,
// so the radial wipe is equivalent to drawing each curve along its length.
export function KrystalFlower({ animated = true, delay = 0, className = '' }: KrystalFlowerProps) {
  return (
    <svg
      viewBox="0 0 500 500"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={CLIP_ID}>
          <motion.circle
            cx={CX}
            cy={CY}
            initial={animated ? { r: 0 } : false}
            animate={{ r: R + 4 }}
            transition={{ duration: DRAW_DURATION, delay, ease: EASE }}
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#${CLIP_ID})`}>
        {SPIRALS.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            opacity={s.dir === 1 ? 0.52 : 0.34}
          />
        ))}
      </g>
    </svg>
  );
}
