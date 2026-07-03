"use client";

import { useEffect, useRef, useState } from "react";
import ChatInput from "./chatinput";
import MessageBubble from "./messagebubble";
import TypingIndicator from "./typingindicator";
import {
  findTopProducts,
  getPotency,
  loadInventory,
  type InventoryProduct,
} from "../../data/inventory";
import { answerKnowledgeQuestion } from "../../lib/knowledgeengine";

type Message = {
  sender: "user" | "tanner";
  text: string;
};

export default function ChatWindow({
  setSelectedProduct,
}: {
  setSelectedProduct: (product: InventoryProduct | null) => void;
}) {
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [inventoryError, setInventoryError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "tanner",
      text: "Tanner online. Ask me for products, effects, flavors, terpenes, or similar strains.",
    },
  ]);

  useEffect(() => {
    loadInventory()
      .then((items) => setInventory(items))
      .catch(() => {
        setInventoryError(
          "Inventory failed to load. Make sure public/inventory.csv exists."
        );
      });
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  function formatMoney(value: number) {
    return value > 0 ? `$${value}` : "price not listed";
  }

  function formatPotency(product: InventoryProduct) {
    const potency = getPotency(product);
    return potency ? `${potency}% THC/THCA` : "potency not listed";
  }

  function buildSmartReply(text: string) {
    if (inventoryError) return inventoryError;

    if (inventory.length === 0) {
      return "Inventory is still loading. Try again in a second.";
    }

    const knowledgeAnswer = answerKnowledgeQuestion(text, inventory);

    if (knowledgeAnswer) {
      return knowledgeAnswer;
    }

    const matches = findTopProducts(inventory, text, 3);

    if (matches.length === 0) {
      return "I couldn’t find a strong in-stock cannabis match for that. Try asking for flower, edibles, vapes, concentrates, pre-rolls, strongest, weakest, low THC, fruity, limonene, or something similar to Super Boof.";
    }

    const topMatch = matches[0];
    const top = topMatch.product;
    const potency = getPotency(top);

    const intro = `I’d start with ${top.product} by ${
      top.vendor || "Unknown Vendor"
    }.`;

    const productDetails = `It’s a ${top.category || "cannabis product"}${
      top.strain ? ` listed as ${top.strain}` : ""
    }, currently priced at ${formatMoney(top.price)}, with ${
      top.available
    } available${top.room ? ` in ${top.room}` : ""}.`;

    const potencyDetails = potency
      ? `The listed potency is ${potency}% THC/THCA, so it fits if you’re looking for something in that strength range.`
      : "The potency is not clearly listed, so I’d confirm THC/THCA with staff before purchase.";

    const why = `Why Tanner picked it: ${topMatch.reasons
      .slice(0, 3)
      .join(", ")}.`;

    const alternatives =
      matches.length > 1
        ? `\n\nTwo other options I’d keep in mind:\n${matches
            .slice(1)
            .map((match, index) => {
              const product = match.product;

              return `${index + 2}. ${product.product} — ${
                product.vendor || "Unknown Vendor"
              }, ${formatPotency(product)}, ${formatMoney(product.price)}`;
            })
            .join("\n")}`
        : "";

    return `${intro}

${productDetails}

${potencyDetails}

${why}${alternatives}

Confirm availability with staff before purchase.`;
  }

  function sendMessage() {
    const text = input.trim();
    if (!text || thinking) return;

    const matches = findTopProducts(inventory, text, 3);
    setSelectedProduct(matches[0]?.product || null);

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "tanner", text: buildSmartReply(text) },
      ]);

      setThinking(false);
    }, 900);
  }

  return (
    <section className="panel flex min-h-[820px] flex-col overflow-hidden">
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-green-400">
              Conversation
            </div>

            <h2 className="mt-2 text-3xl font-black">Tanner Chat</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Inventory loaded: {inventory.length} products
            </p>
          </div>

          <div className="glass rounded-full px-5 py-2 text-sm neon">
            {thinking ? "THINKING" : "READY"}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-6">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}

        {thinking && <TypingIndicator />}

        <div ref={endRef} />
      </div>

      <ChatInput
        value={input}
        thinking={thinking}
        onChange={setInput}
        onSend={sendMessage}
      />
    </section>
  );
}
