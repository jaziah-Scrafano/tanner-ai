"use client";

export default function OrbCore() {
  return (
    <div className="relative z-30">
      <div className="absolute inset-0 scale-[2.4] animate-pulse rounded-full bg-green-400/20 blur-3xl" />
      <div className="absolute inset-0 scale-[1.8] animate-pulse rounded-full bg-cyan-400/10 blur-2xl" />

      <div className="relative h-56 w-56 animate-pulse rounded-full bg-[radial-gradient(circle_at_28%_20%,white,#bbf7d0_10%,#39ff88_32%,#064e3b_68%,#020617_100%)] shadow-[inset_-35px_-35px_80px_#000000cc,0_0_170px_#39ff88]">
        <div className="absolute left-10 top-9 h-16 w-16 rounded-full bg-white/70 blur-2xl" />
        <div className="absolute inset-4 rounded-full border border-white/10" />
        <div className="absolute inset-8 rounded-full border border-green-300/20" />
      </div>
    </div>
  );
}
