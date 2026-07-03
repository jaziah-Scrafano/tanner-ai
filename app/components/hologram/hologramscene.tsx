"use client";

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import EnergyCore from "./energycore";
import EnergyShell from "./energyshell";
import OrbitalRings from "./orbitalrings";
import ParticleField from "./particlefield";
import ProjectorBeam from "./projectorbeam";
import ReactorChamber from "./reactorchamber";
import Lighting from "./lighting";
import CameraRig from "./camerarig";
import type { HologramStatus } from "./hologram";

export default function HologramScene({
  status,
}: {
  status: HologramStatus;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
      <color attach="background" args={["#020617"]} />

      <Lighting status={status} />
      <CameraRig />

      <ReactorChamber status={status} />
      <ProjectorBeam status={status} />
      <EnergyShell status={status} />
      <OrbitalRings status={status} />
      <EnergyCore status={status} />
      <ParticleField status={status} />

      <EffectComposer>
        <Bloom intensity={2.2} luminanceThreshold={0.15} />
      </EffectComposer>
    </Canvas>
  );
}