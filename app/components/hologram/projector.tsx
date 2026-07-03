"use client";

export default function Projector() {
  return (
    <>
      <div className="absolute bottom-28 h-[340px] w-[250px] bg-gradient-to-t from-green-400/20 via-green-400/5 to-transparent blur-2xl" />
      <div className="absolute bottom-20 h-12 w-80 rounded-full border border-green-400/40 bg-green-400/10 blur-[1px] shadow-[0_0_80px_#39ff88]" />
      <div className="absolute bottom-10 h-8 w-56 rounded-full bg-green-400/15 blur-xl" />
    </>
  );
}