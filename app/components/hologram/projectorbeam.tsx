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
        args={[0.24, 1.08, 3.55, 96, 1, true]}
        position={[0, -1.82, 0]}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.13}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </Cylinder>

      <Torus
        ref={baseRing}
        args={[1.28, 0.028, 32, 220]}
        position={[0, -3.35, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3.8}
        />
      </Torus>

      <Torus
        ref={topRing}
        args={[0.44, 0.014, 24, 160]}
        position={[0, -0.32, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#ffffff"
          emissive={color}
          emissiveIntensity={3}
        />
      </Torus>

      <pointLight position={[0, -2.6, 0]} color={color} intensity={3} />
    </>
  );
}
