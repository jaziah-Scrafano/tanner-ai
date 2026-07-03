"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";

export default function CameraRig() {
  const { camera, pointer } = useThree();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Floating camera movement
    const targetX = pointer.x * 0.35 + Math.sin(t * 0.4) * 0.08;
    const targetY = pointer.y * 0.25 + Math.cos(t * 0.35) * 0.06;

    easing.damp3(
      camera.position,
      [targetX, targetY, 6],
      0.25,
      delta
    );

    easing.dampE(
      camera.rotation,
      [
        targetY * 0.04,
        targetX * 0.05,
        Math.sin(t * 0.15) * 0.01,
      ],
      0.25,
      delta
    );

    camera.lookAt(0, 0, 0);
  });

  return null;
}