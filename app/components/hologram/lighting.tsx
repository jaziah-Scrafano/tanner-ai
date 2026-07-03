"use client";

import type { HologramStatus } from "./hologram";

export default function Lighting({
  status,
}: {
  status: HologramStatus;
}) {
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
      <ambientLight intensity={0.35} />

      <pointLight
        position={[0, 0, 3]}
        color={color}
        intensity={4}
      />

      <pointLight
        position={[3, 2, 2]}
        color="#22d3ee"
        intensity={2.5}
      />

      <pointLight
        position={[-3, -1, 2]}
        color="#a855f7"
        intensity={2}
      />

      <spotLight
        position={[0, 5, 4]}
        angle={0.45}
        penumbra={0.7}
        intensity={3}
        color={color}
      />
    </>
  );
}