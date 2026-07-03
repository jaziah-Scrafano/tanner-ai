"use client";

export default function Rings() {
  return (
    <>
      <div className="absolute h-[560px] w-[560px] animate-[spin_28s_linear_infinite] rounded-full border border-green-400/10" />
      <div className="absolute h-[450px] w-[450px] animate-[spin_18s_linear_infinite_reverse] rounded-full border border-cyan-400/20" />
      <div className="absolute h-[360px] w-[360px] animate-[spin_12s_linear_infinite] rounded-full border border-lime-300/25" />

      <div className="absolute h-[310px] w-[580px] rotate-12 rounded-[50%] border border-green-400/20" />
      <div className="absolute h-[310px] w-[580px] -rotate-12 rounded-[50%] border border-cyan-300/20" />

      <div className="absolute h-[390px] w-[390px] animate-[spin_5s_linear_infinite] rounded-full border-t-2 border-green-300 border-b-transparent border-l-transparent border-r-transparent" />
      <div className="absolute h-[300px] w-[300px] animate-[spin_7s_linear_infinite_reverse] rounded-full border-b-2 border-cyan-300 border-l-transparent border-r-transparent border-t-transparent" />
    </>
  );
}