"use client";

export default function TypingIndicator() {
  return (
    <div className="glass inline-flex w-fit items-center gap-2 rounded-full px-5 py-3">
      <div className="h-2 w-2 animate-bounce rounded-full bg-green-400" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-green-400 [animation-delay:.15s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-green-400 [animation-delay:.3s]" />

      <span className="ml-2 text-sm text-zinc-400">
        Tanner is thinking...
      </span>
    </div>
  );
}
