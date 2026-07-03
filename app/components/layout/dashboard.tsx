"use client";

import { useState } from "react";
import Hologram, { type HologramStatus } from "../hologram/hologram";
import ChatWindow from "../chat/chatwindow";
import ProductCard from "../inventory/productcard";
import StatusPanel from "../system/statuspanel";
import Diagnostics from "../system/diagnostics";
import type { InventoryProduct } from "../../data/inventory";

export default function Dashboard() {
  const [selectedProduct, setSelectedProduct] =
    useState<InventoryProduct | null>(null);

  const [hologramStatus, setHologramStatus] =
    useState<HologramStatus>("ready");

  const statusGlow =
    hologramStatus === "thinking"
      ? "shadow-[0_0_90px_rgba(168,85,247,.22)]"
      : hologramStatus === "speaking"
      ? "shadow-[0_0_90px_rgba(251,146,60,.22)]"
      : hologramStatus === "listening"
      ? "shadow-[0_0_90px_rgba(34,211,238,.22)]"
      : "shadow-[0_0_90px_rgba(57,255,136,.16)]";

  return (
    <main className="h-screen overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(57,255,136,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,136,.04)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <section className="relative z-10 mx-auto flex h-full max-w-[1800px] flex-col">
        <div className={`panel flex h-full flex-col overflow-hidden transition-all duration-500 ${statusGlow}`}>
          <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-7 py-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-300">
                Broad St Buds Neural Interface
              </p>

              <h1 className="mt-2 text-5xl font-black tracking-tight">
                TANNER <span className="neon">A.I.</span>
              </h1>

              <p className="mt-1 text-zinc-400">
                Holographic Budtender Operating System
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="glass rounded-full px-5 py-3">
                <span className="font-black neon">ONLINE ●</span>
              </div>

              <div className="glass rounded-full px-5 py-3 text-zinc-300">
                {hologramStatus.toUpperCase()}
              </div>
            </div>
          </header>

          <div className="grid min-h-0 flex-1 grid-cols-[340px_1fr_360px] gap-5 p-5">
            <section className="panel min-h-0 overflow-hidden">
              <Hologram status={hologramStatus} />
            </section>

            <ChatWindow
              setSelectedProduct={setSelectedProduct}
              setHologramStatus={setHologramStatus}
            />

            <section className="min-h-0 space-y-5 overflow-y-auto pr-1">
              <ProductCard product={selectedProduct} />
              <StatusPanel />
            </section>
          </div>

          <div className="shrink-0">
            <Diagnostics />
          </div>
        </div>
      </section>
    </main>
  );
}