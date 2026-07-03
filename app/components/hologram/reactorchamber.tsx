"use client";

import { Cylinder, Torus } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { HologramStatus } from "./hologram";

export default function ReactorChamber({
  status,
}: {
  status: HologramStatus;
}) {
  const topRing = useRef<THREE.Mesh>(null);
  const bottomRing = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const speed =
      status === "thinking"
        ? 1.4
        : status === "speaking"
        ? 1.1
        : status === "listening"
        ? 0.8
        : 0.45;

    if (topRing.current) topRing.current.rotation.z += delta * speed;
    if (bottomRing.current) bottomRing.current.rotation.z -= delta * speed;
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
      <Cylinder args={[2.15, 2.15, 4.4, 96, 1, true]} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          color="#dffbff"
          transparent
          opacity={0.09}
          roughness={0}
          metalness={0}
          transmission={0.9}
          thickness={0.8}
          ior={1.45}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </Cylinder>

      <Torus ref={topRing} args={[2.16, 0.035, 32, 220]} position={[0, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.2} />
      </Torus>

      <Torus ref={bottomRing} args={[2.16, 0.04, 32, 220]} position={[0, -2.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.8} />
      </Torus>

      <Cylinder args={[2.18, 2.18, 4.45, 96, 1, true]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.025}
          wireframe
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </Cylinder>
    </>
  );
}