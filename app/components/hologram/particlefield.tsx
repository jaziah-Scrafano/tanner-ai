"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { HologramStatus } from "./hologram";

export default function ParticleField({
  status,
}: {
  status: HologramStatus;
}) {
  const points = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(220 * 3);

    for (let i = 0; i < 220; i++) {
      const radius = 1.7 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!points.current) return;

    const speed =
      status === "thinking"
        ? 0.35
        : status === "speaking"
        ? 0.26
        : status === "listening"
        ? 0.18
        : 0.1;

    points.current.rotation.y += delta * speed;
    points.current.rotation.x += delta * speed * 0.35;
  });

  const color =
    status === "thinking"
      ? "#a855f7"
      : status === "speaking"
      ? "#fb923c"
      : status === "listening"
      ? "#22d3ee"
      : "#39ff88";

  return (
    <Points ref={points} positions={particles} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color={color}
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.75}
      />
    </Points>
  );
}
