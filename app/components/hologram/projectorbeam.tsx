"use client";

import { Cylinder, Torus } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { HologramStatus } from "./hologram";

export default function ProjectorBeam({
  status,
}: {
  status: HologramStatus;
}) {
  const beam = useRef<THREE.Mesh>(null);
  const baseRing = useRef<THREE.Mesh>(null);
  const topRing = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const speed =
      status === "thinking"
        ? 2
        : status === "speaking"
        ? 1.5
        : status === "listening"
        ? 1.1
        : 0.7;

    if (beam.current) {
      const pulse = 1 + Math.sin(clock.elapsedTime * speed * 3) * 0.08;
      beam.current.scale.set(pulse, 1, pulse);
    }

    if (baseRing.current) baseRing.current.rotation.z += delta * speed;
    if (topRing.current) topRing.current.rotation.z -= delta * speed * 0.8;
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
    <>
      <Cylinder
        ref={beam}
        args={[0.22, 1.05, 3.4, 64, 1, true]}
        position={[0, -1.8, 0]}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </Cylinder>

      <Torus
        ref={baseRing}
        args={[1.25, 0.025, 32, 180]}
        position={[0, -3.35, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3.5}
        />
      </Torus>

      <Torus
        ref={topRing}
        args={[0.42, 0.012, 24, 120]}
        position={[0, -0.35, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#ffffff"
          emissive={color}
          emissiveIntensity={2.8}
        />
      </Torus>

      <pointLight position={[0, -2.6, 0]} color={color} intensity={2.8} />
    </>
  );
}