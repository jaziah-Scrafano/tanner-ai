export default function StatusPanel() {
  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-green-400">
            Neural Status
          </div>
          <h2 className="mt-2 text-3xl font-black">System</h2>
        </div>

        <div className="h-3 w-3 animate-pulse rounded-full bg-green-400 shadow-[0_0_20px_#39ff88]" />
      </div>

      <div className="mt-8 space-y-5">
        <Stat label="AI Core" value="ONLINE" />
        <Stat label="Voice" value="READY" />
        <Stat label="Conversation" value="ACTIVE" />
        <Stat label="Memory" value="READY" />
        <Stat label="Inventory" value="WAITING" />
        <Stat label="Recommendations" value="ACTIVE" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3">
      <span className="text-zinc-400">{label}</span>
      <span className="font-bold neon">{value}</span>
    </div>
  );
}
