"use client";

import { MeshDistortMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { HologramStatus } from "./hologram";

export default function EnergyCore({
  status,
}: {
  status: HologramStatus;
}) {
  const orb = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!orb.current || !glow.current || !core.current) return;

    const speed =
      status === "thinking"
        ? 2.4
        : status === "speaking"
        ? 2
        : status === "listening"
        ? 1.4
        : 0.8;

    orb.current.rotation.y += delta * speed * 0.35;
    orb.current.rotation.x += delta * speed * 0.15;

    glow.current.rotation.y -= delta * speed * 0.2;

    const pulse =
      1 +
      Math.sin(clock.elapsedTime * speed * 2.5) *
        (status === "speaking"
          ? 0.08
          : status === "thinking"
          ? 0.06
          : 0.035);

    orb.current.scale.setScalar(pulse);

    glow.current.scale.setScalar(
      pulse + (status === "thinking" ? 0.25 : 0.18)
    );

    core.current.scale.setScalar(
      0.34 + Math.sin(clock.elapsedTime * 5) * 0.015
    );
  });

  const color =
    status === "thinking"
      ? "#9d4edd"
      : status === "speaking"
      ? "#fb923c"
      : status === "listening"
      ? "#22d3ee"
      : "#39ff88";

  return (
    <>
      {/* Outer Glow */}
      <mesh ref={glow}>
        <sphereGeometry args={[1.45, 64, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Energy Orb */}
      <mesh ref={orb}>
        <sphereGeometry args={[1, 128, 128]} />

        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={5}
          distort={0.35}
          speed={3}
          roughness={0}
          metalness={0.15}
        />
      </mesh>

      {/* Inner Plasma */}
      <mesh scale={0.72}>
        <sphereGeometry args={[1, 64, 64]} />

        <meshPhysicalMaterial
          color="#ffffff"
          emissive={color}
          emissiveIntensity={6}
          transparent
          opacity={0.25}
          transmission={1}
          roughness={0}
          metalness={0}
        />
      </mesh>

      {/* Core */}
      <mesh ref={core}>
        <sphereGeometry args={[0.32, 64, 64]} />

        <meshStandardMaterial
          color="white"
          emissive="white"
          emissiveIntensity={10}
        />
      </mesh>

      {/* Bright Highlight */}
      <mesh position={[-0.3, 0.35, 0.7]}>
        <sphereGeometry args={[0.08, 32, 32]} />

        <meshBasicMaterial
          color="white"
          transparent
          opacity={0.9}
        />
      </mesh>
    </>
  );
}
