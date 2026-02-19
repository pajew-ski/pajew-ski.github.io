import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Particles({ count = 2500 }) {
  const points = useRef<THREE.Points>(null!);

  // Create initial random positions
  const { positions, originalPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 25;
      const y = (Math.random() - 0.5) * 25;
      const z = (Math.random() - 0.5) * 15;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
    }
    return { positions, originalPositions };
  }, [count]);

  const hoverRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouseX = state.pointer.x * 12;
    const mouseY = state.pointer.y * 7;

    // Smoothly interpolate mouse position
    hoverRef.current.lerp(new THREE.Vector3(mouseX, mouseY, 0), 0.1);

    // Access the current position attribute array
    const positionsArray = points.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      const oz = originalPositions[i3 + 2];

      // 1. Base Motion: Gentle, chaotic floating (Brownian-like)
      // Using sin/cos with different frequencies to simulate randomness
      let x = ox + Math.sin(time * 0.2 + ox * 0.5) * 0.5;
      let y = oy + Math.cos(time * 0.15 + oy * 0.5) * 0.5;
      let z = oz + Math.sin(time * 0.1 + oz * 0.5) * 0.5;

      // 2. Interaction: "Entropy Reduction" / "Negentropy"
      // When near the cursor (observer), particles snap to a rigid integer grid
      const dx = hoverRef.current.x - x;
      const dy = hoverRef.current.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 6) {
        // Calculate influence based on distance (closer = stronger order)
        const strength = Math.pow((6 - dist) / 6, 2);

        // Target: The nearest integer grid point
        const gridX = Math.round(x);
        const gridY = Math.round(y);
        const gridZ = Math.round(z); // Flattening to z-planes

        // Lerp towards order
        x = x + (gridX - x) * strength * 0.8;
        y = y + (gridY - y) * strength * 0.8;
        z = z + (gridZ - z) * strength * 0.8;
      }

      positionsArray[i3] = x;
      positionsArray[i3 + 1] = y;
      positionsArray[i3 + 2] = z;
    }

    points.current.geometry.attributes.position.needsUpdate = true;

    // Slowly rotate the entire cloud for cinematic effect
    points.current.rotation.y = time * 0.02;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#888888"
        size={0.035}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

export function ParticleNetwork() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
