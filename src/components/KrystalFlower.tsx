import { motion } from 'framer-motion';

const CX = 250;
const CY = 250;
const R = 200;
const r0 = R / 64;

function generateSpiralPath(baseAngle: number, dir: number): string {
  const TURNS = 1.5;
  const STEPS = 360;
  const parts: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const theta = (i / STEPS) * TURNS * 2 * Math.PI;
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

interface KrystalFlowerProps {
  animated?: boolean;
  delay?: number;
  className?: string;
}

// 24 logarithmic spirals (12 per direction), nothing else. All strokes are in
// viewBox units and linecaps stay at the default "butt": non-scaling-stroke
// plus dasharray animation renders as dotted lines on iOS Safari, and round
// caps show a dot per path while pathLength is still 0.
export function KrystalFlower({ animated = true, delay = 0, className = '' }: KrystalFlowerProps) {
  return (
    <svg
      viewBox="0 0 500 500"
      className={className}
      aria-hidden="true"
    >
      {SPIRALS.map((s, i) => (
        <motion.path
          key={i}
          d={s.path}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          opacity={s.dir === 1 ? 0.52 : 0.34}
          initial={animated ? { pathLength: 0 } : undefined}
          animate={{ pathLength: 1 }}
          transition={{ duration: DRAW_DURATION, delay, ease: EASE }}
        />
      ))}
    </svg>
  );
}
