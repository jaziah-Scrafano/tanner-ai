"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { HologramStatus } from "./hologram";

export default function EnergyShell({
  status,
}: {
  status: HologramStatus;
}) {
  const shell = useRef<THREE.Mesh>(null);
  const shield = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!shell.current || !shield.current) return;

    const speed =
      status === "thinking"
        ? 1.5
        : status === "speaking"
        ? 1.1
        : status === "listening"
        ? 0.8
        : 0.45;

    shell.current.rotation.y -= delta * speed;
    shell.current.rotation.x += delta * speed * 0.35;

    shield.current.rotation.y += delta * speed * 0.25;
    shield.current.rotation.z -= delta * speed * 0.18;
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
      <mesh ref={shell} scale={1.38}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.18}
          roughness={0}
          metalness={0}
          transmission={0.85}
          thickness={0.5}
          ior={1.35}
          emissive={color}
          emissiveIntensity={0.7}
          wireframe
        />
      </mesh>

      <mesh ref={shield} scale={1.72}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.045}
          wireframe
        />
      </mesh>
    </>
  );
}
