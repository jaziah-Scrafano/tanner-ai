"use client";

import { useEffect, useRef, useState } from "react";
import ChatInput from "./chatinput";
import MessageBubble from "./messagebubble";
import TypingIndicator from "./typingindicator";
import { loadInventory, type InventoryProduct } from "../../data/inventory";
import {
  emptyMemory,
  type ConversationMemory,
} from "../../lib/memoryengine";
import { runConversationEngine } from "../../lib/conversationengine";
import type { HologramStatus } from "../hologram/hologram";

type Message = {
  sender: "user" | "tanner";
  text: string;
};

export default function ChatWindow({
  setSelectedProduct,
  setHologramStatus,
}: {
  setSelectedProduct: (product: InventoryProduct | null) => void;
  setHologramStatus: (status: HologramStatus) => void;
}) {
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [inventoryError, setInventoryError] = useState("");
  const [memory, setMemory] = useState<ConversationMemory>(emptyMemory);

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

  function buildReply(question: string) {
    if (inventoryError) {
      return {
        answer: inventoryError,
        selectedProduct: null,
        recommendations: [],
        category: memory.lastCategory,
      };
    }

    if (inventory.length === 0) {
      return {
        answer: "Inventory is still loading. Try again in a second.",
        selectedProduct: null,
        recommendations: [],
        category: memory.lastCategory,
      };
    }

    return runConversationEngine({
      question,
      inventory,
      memory,
    });
  }

  function sendMessage() {
    const question = input.trim();
    if (!question || thinking) return;

    if (question.toLowerCase() === "reset") {
      setMemory(emptyMemory);
      setSelectedProduct(null);
      setHologramStatus("ready");

      setMessages((prev) => [
        ...prev,
        { sender: "user", text: question },
        { sender: "tanner", text: "Conversation memory reset." },
      ]);

      setInput("");
      return;
    }

    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");
    setThinking(true);
    setHologramStatus("thinking");

    setTimeout(() => {
      const result = buildReply(question);

      setSelectedProduct(result.selectedProduct);

      setMemory({
        lastQuestion: question,
        lastAnswer: result.answer,
        lastCategory: result.category,
        lastRecommendations: result.recommendations,
        selectedProduct: result.selectedProduct,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "tanner", text: result.answer },
      ]);

      setThinking(false);
      setHologramStatus("speaking");

      setTimeout(() => {
        setHologramStatus("ready");
      }, 1200);
    }, 700);
  }

  return (
    <section className="panel flex min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-white/10 px-6 py-5">
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

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}

        {thinking && <TypingIndicator />}

        <div ref={endRef} />
      </div>

      <div className="shrink-0">
        <ChatInput
          value={input}
          thinking={thinking}
          onChange={(value) => {
            setInput(value);
            setHologramStatus(value.trim() ? "listening" : "ready");
          }}
          onSend={sendMessage}
        />
      </div>
    </section>
  );
}
