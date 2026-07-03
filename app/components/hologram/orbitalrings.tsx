"use client";

import { Torus } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { HologramStatus } from "./hologram";

export default function OrbitalRings({
  status,
}: {
  status: HologramStatus;
}) {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const ring4 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const speed =
      status === "thinking"
        ? 1.9
        : status === "speaking"
        ? 1.4
        : status === "listening"
        ? 1.0
        : 0.55;

    if (ring1.current) ring1.current.rotation.y += delta * speed;
    if (ring2.current) ring2.current.rotation.x -= delta * speed * 0.8;
    if (ring3.current) ring3.current.rotation.z += delta * speed * 1.25;

    if (ring4.current) {
      ring4.current.rotation.x += delta * speed * 0.45;
      ring4.current.rotation.y += delta * speed * 0.32;
    }
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
      <Torus ref={ring1} args={[1.72, 0.015, 32, 220]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </Torus>

      <Torus ref={ring2} rotation={[Math.PI / 2, 0, 0]} args={[1.46, 0.012, 32, 180]}>
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.6} />
      </Torus>

      <Torus ref={ring3} rotation={[0.7, 0.4, 0.6]} args={[1.22, 0.01, 32, 180]}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.7} />
      </Torus>

      <Torus ref={ring4} rotation={[1.2, 0, 0]} args={[2.05, 0.006, 24, 180]}>
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </Torus>
    </>
  );
}
