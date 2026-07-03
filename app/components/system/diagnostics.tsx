
export default function Diagnostics() {
	return (
		<div className="border-t border-white/10 bg-black/20 px-6 py-5">
			<div className="grid grid-cols-6 gap-4">
				<HudCard title="Latency" value="12 ms" />
				<HudCard title="Confidence" value="98%" />
				<HudCard title="Voice" value="Ready" />
				<HudCard title="Inventory" value="CSV" />
				<HudCard title="Memory" value="Local" />
				<HudCard title="Version" value="2.0" />
			</div>
		</div>
	);
}

function HudCard({ title, value }: { title: string; value: string }) {
	return (
		<div className="glass rounded-2xl p-4">
			<div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
				{title}
			</div>
			<div className="mt-2 text-2xl font-black neon">{value}</div>
		</div>
	);
}
