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

export function KrystalFlower({ animated = true, delay = 0, className = '' }: KrystalFlowerProps) {
  const ringTransition = { duration: 0.4, delay, ease: EASE };
  const spiralTransition = { duration: DRAW_DURATION, delay: delay + 0.1, ease: EASE };

  return (
    <svg
      viewBox="0 0 500 500"
      className={className}
      aria-hidden="true"
    >
      {/* Monad inner ring — proportion marker at 0.905 × R */}
      <motion.circle
        cx={CX} cy={CY} r={R * 0.905}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.38}
        vectorEffect="non-scaling-stroke"
        initial={animated ? { opacity: 0 } : undefined}
        animate={{ opacity: 0.14 }}
        transition={ringTransition}
      />

      {/* 24 logarithmic spirals: 12 CW (opacity 0.52) + 12 CCW (opacity 0.34) */}
      {SPIRALS.map((s, i) => (
        <motion.path
          key={i}
          d={s.path}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.85}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={s.dir === 1 ? 0.52 : 0.34}
          initial={animated ? { pathLength: 0 } : undefined}
          animate={{ pathLength: 1 }}
          transition={spiralTransition}
        />
      ))}

      {/* Monad outer ring — boundary of the complete field */}
      <motion.circle
        cx={CX} cy={CY} r={R}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.1}
        vectorEffect="non-scaling-stroke"
        initial={animated ? { opacity: 0 } : undefined}
        animate={{ opacity: 0.4 }}
        transition={ringTransition}
      />

      {/* Center dot — zero-point source (r scales proportionally with logo) */}
      <motion.circle
        cx={CX} cy={CY} r={8}
        fill="currentColor"
        initial={animated ? { opacity: 0 } : undefined}
        animate={{ opacity: 0.96 }}
        transition={ringTransition}
      />
    </svg>
  );
}
