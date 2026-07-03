import { getPotency, type InventoryProduct } from "../../data/inventory";

export default function ProductCard({
  product,
}: {
  product: InventoryProduct | null;
}) {
  if (!product) {
    return (
      <div className="panel overflow-hidden p-6 transition-all duration-500">
        <Header status="Waiting" />

        <div className="mt-6 flex h-72 items-center justify-center rounded-3xl border border-cyan-400/20 bg-slate-950/70 shadow-[inset_0_0_50px_rgba(34,211,238,.08)]">
          <div className="animate-pulse text-center">
            <div className="text-7xl">🌿</div>
            <p className="mt-4 text-sm uppercase tracking-[0.25em] text-cyan-300">
              No product selected
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-7 text-zinc-400">
          Ask Tanner for a product and the top match will appear here.
        </p>
      </div>
    );
  }

  const potency = getPotency(product);
  const hasImage = product.imageUrl && product.imageUrl.startsWith("http");

  return (
    <div
      key={product.sku || product.product}
      className="panel overflow-hidden p-6 transition-all duration-500 animate-[fadeIn_.35s_ease]"
    >
      <Header status="Recommended" />

      <div className="mt-6 overflow-hidden rounded-3xl border border-cyan-400/25 bg-slate-950/80 shadow-[0_0_40px_rgba(34,211,238,.16)] transition-all duration-500">
        {hasImage ? (
          <img
            src={product.imageUrl}
            alt={product.product}
            className="h-72 w-full object-cover opacity-0 animate-[imageFade_.45s_ease_forwards]"
          />
        ) : (
          <div className="flex h-72 items-center justify-center">
            <div className="text-center">
              <div className="text-7xl">🌿</div>
              <p className="mt-3 text-zinc-500">No image available</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
              Top Match
            </p>

            <h3 className="mt-2 text-3xl font-black leading-tight text-white">
              {product.product}
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              {product.vendor || "Unknown Vendor"}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-center shadow-[0_0_24px_rgba(57,255,136,.2)] transition-transform duration-500 hover:scale-105">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
              THC
            </div>
            <div className="mt-1 text-xl font-black neon">
              {potency ? `${potency}%` : "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <MiniCard label="Price" value={`$${product.price}`} />
        <MiniCard label="Stock" value={String(product.available)} />
        <MiniCard label="Category" value={product.category || "--"} />
        <MiniCard label="CBD" value={product.cbd ? `${product.cbd}%` : "N/A"} />
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
          Product Data
        </p>

        <div className="mt-5 space-y-4">
          <Stat label="Strain" value={product.strain || "--"} />
          <Stat label="Room" value={product.room || "--"} />
          <Stat label="SKU" value={product.sku || "--"} />
          <Stat label="Flower Equiv" value={product.flowerEquiv || "--"} />
        </div>
      </div>
    </div>
  );
}

function Header({ status }: { status: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">
          Recommendation
        </div>
        <h2 className="mt-2 text-3xl font-black">Product Match</h2>
      </div>

      <div className="rounded-full border border-cyan-400/30 bg-slate-950/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] neon">
        {status}
      </div>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-4 shadow-[inset_0_0_20px_rgba(34,211,238,.05)] transition-all duration-300 hover:border-cyan-300/50 hover:shadow-[0_0_20px_rgba(34,211,238,.12)]">
      <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/60">
        {label}
      </div>
      <div className="mt-2 truncate text-lg font-black text-white">{value}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="max-w-[180px] truncate text-right text-sm font-bold text-white">
        {value}
      </span>
    </div>
  );
}
