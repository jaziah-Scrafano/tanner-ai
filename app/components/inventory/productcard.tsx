import { getPotency, type InventoryProduct } from "../../data/inventory";

export default function ProductCard({
  product,
}: {
  product: InventoryProduct | null;
}) {
  if (!product) {
    return (
      <div className="panel p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-green-400">
              Recommendation
            </div>
            <h2 className="mt-2 text-3xl font-black">Product Match</h2>
          </div>

          <div className="glass rounded-full px-4 py-2 neon">Waiting</div>
        </div>

        <div className="mt-6 flex h-60 items-center justify-center rounded-3xl border border-dashed border-green-400/20 bg-black/20">
          <div className="text-center">
            <div className="text-6xl">🌿</div>
            <p className="mt-3 text-zinc-500">Ask Tanner for a product.</p>
          </div>
        </div>

        <h3 className="mt-6 text-3xl font-black">No Product Selected</h3>
        <p className="mt-2 leading-7 text-zinc-500">
          Tanner will show the top recommendation here after searching inventory.
        </p>
      </div>
    );
  }

  const potency = getPotency(product);
  const hasImage = product.imageUrl && product.imageUrl.startsWith("http");

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-green-400">
            Recommendation
          </div>
          <h2 className="mt-2 text-3xl font-black">Product Match</h2>
        </div>

        <div className="glass rounded-full px-4 py-2 neon">Top Pick</div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-green-400/20 bg-black/30">
        {hasImage ? (
          <img
            src={product.imageUrl}
            alt={product.product}
            className="h-60 w-full object-cover"
          />
        ) : (
          <div className="flex h-60 items-center justify-center">
            <div className="text-center">
              <div className="text-6xl">🌿</div>
              <p className="mt-3 text-zinc-500">No image available</p>
            </div>
          </div>
        )}
      </div>

      <h3 className="mt-6 text-3xl font-black leading-tight">
        {product.product}
      </h3>

      <p className="mt-2 text-zinc-500">{product.vendor || "Unknown Vendor"}</p>

      <div className="mt-8 space-y-4">
        <Stat label="Category" value={product.category || "--"} />
        <Stat label="Strain" value={product.strain || "--"} />
        <Stat label="THC/THCA" value={potency ? `${potency}%` : "N/A"} />
        <Stat label="CBD" value={product.cbd ? `${product.cbd}%` : "N/A"} />
        <Stat label="Price" value={`$${product.price}`} />
        <Stat label="Available" value={String(product.available)} />
        <Stat label="Room" value={product.room || "--"} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3">
      <span className="text-zinc-400">{label}</span>
      <span className="max-w-[170px] text-right font-bold neon">{value}</span>
    </div>
  );
}
