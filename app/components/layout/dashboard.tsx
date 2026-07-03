"use client";

import { useState } from "react";
import Hologram from "../hologram/hologram";
import ChatWindow from "../chat/chatwindow";
import ProductCard from "../inventory/productcard";
import StatusPanel from "../system/statuspanel";
import Diagnostics from "../system/diagnostics";
import type { InventoryProduct } from "../../data/inventory";

export default function Dashboard() {
  const [selectedProduct, setSelectedProduct] =
    useState<InventoryProduct | null>(null);

  return (
    <main className="relative min-h-screen overflow-hidden p-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(57,255,136,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,136,.04)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <section className="relative z-10 mx-auto max-w-[1800px]">
        <div className="panel overflow-hidden">
          <header className="flex items-center justify-between border-b border-white/10 px-7 py-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-green-400">
                Broad St Buds Neural Interface
              </p>

              <h1 className="mt-2 text-6xl font-black tracking-tight">
                TANNER <span className="neon">A.I.</span>
              </h1>

              <p className="mt-2 text-zinc-400">
                Holographic Budtender Operating System
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="glass rounded-full px-5 py-3">
                <span className="font-black neon">ONLINE ●</span>
              </div>

              <div className="glass rounded-full px-5 py-3 text-zinc-300">
                Version 2.0
              </div>
            </div>
          </header>

          <div className="grid min-h-[820px] grid-cols-[360px_1fr_360px] gap-6 p-6">
            <section className="panel overflow-hidden">
              <Hologram />
            </section>

            <ChatWindow setSelectedProduct={setSelectedProduct} />

            <section className="space-y-6">
              <ProductCard product={selectedProduct} />
              <StatusPanel />
            </section>
          </div>
          <Diagnostics />
        </div>
      </section>
    </main>
  );
}
