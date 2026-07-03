"use client";

import HologramScene from "./hologramscene";

export type HologramStatus =
  | "ready"
  | "listening"
  | "thinking"
  | "speaking";

export default function Hologram({
  status = "ready",
}: {
  status?: HologramStatus;
}) {
  const label = status.toUpperCase();

  return (
    <div
      className={`holo-tube status-${status} relative h-full overflow-hidden`}
    >
      <div className="scanline" />

      <div className="pointer-events-none absolute inset-x-6 top-5 z-20 rounded-full border border-cyan-300/20 bg-slate-950/70 py-4 text-center backdrop-blur-xl">
        <h2 className="text-3xl font-black tracking-[0.22em] neon">
          TANNER CORE
        </h2>

        <p className="mt-2 text-xs font-bold uppercase tracking-[0.32em] text-white/80">
          WebGL Neural Interface
        </p>
      </div>

      <div className="pointer-events-none absolute left-6 top-28 z-20 space-y-3">
        <MiniStat label="Core" value="Online" />
        <MiniStat label="Sync" value="98%" />
        <MiniStat label="Mode" value={label} />
      </div>

      <div className="pointer-events-none absolute right-6 top-28 z-20 space-y-3">
        <MiniStat label="Signal" value="Live" />
        <MiniStat label="Render" value="3D" />
        <MiniStat label="Bloom" value="Active" />
      </div>

      <div className="absolute inset-x-8 bottom-24 top-24 z-10 rounded-[38px] border border-cyan-300/20 bg-gradient-to-b from-white/10 via-cyan-300/5 to-white/5 shadow-[inset_0_0_55px_rgba(34,211,238,.12)]" />

      <div className="absolute left-1/2 top-24 z-20 h-4 w-48 -translate-x-1/2 rounded-full border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_45px_rgba(34,211,238,.45)]" />

      <div className="absolute bottom-24 left-1/2 z-20 h-4 w-56 -translate-x-1/2 rounded-full border border-green-300/30 bg-green-300/10 shadow-[0_0_55px_rgba(57,255,136,.45)]" />

      <HologramScene status={status} />

      <div className="absolute bottom-5 left-5 right-5 z-20">
        <div className="rounded-2xl border border-cyan-400/30 bg-slate-950/80 p-4 text-center shadow-[0_0_22px_rgba(34,211,238,.22)] backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">
            Current State
          </p>

          <p className="mt-1 text-lg font-black uppercase neon">{label}</p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-28 rounded-2xl border border-cyan-400/30 bg-slate-950/80 px-3 py-2 text-center shadow-[0_0_18px_rgba(34,211,238,.18)] backdrop-blur-xl">
      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white drop-shadow-[0_0_6px_rgba(0,0,0,.9)]">
        {label}
      </div>

      <div className="mt-1 text-sm font-black neon">{value}</div>
    </div>
  );
}
