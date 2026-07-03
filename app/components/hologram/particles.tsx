"use client";

const particles = [
  "left-[18%] top-[24%] animate-ping",
  "left-[72%] top-[28%] animate-pulse",
  "left-[28%] top-[72%] animate-bounce",
  "left-[80%] top-[68%] animate-ping",
  "left-[48%] top-[18%] animate-pulse",
  "left-[42%] top-[82%] animate-bounce",
  "left-[12%] top-[54%] animate-pulse",
  "left-[86%] top-[48%] animate-ping",
];

export default function Particles() {
  return (
    <>
      {particles.map((position, index) => (
        <div
          key={index}
          className={`absolute h-2.5 w-2.5 rounded-full bg-green-300 shadow-[0_0_25px_#39ff88] ${position}`}
        />
      ))}
    </>
  );
}
