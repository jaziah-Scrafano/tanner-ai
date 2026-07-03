"use client";

import { useState } from "react";
import type { InventoryProduct } from "../data/inventory";

export type ConversationMemory = {
  lastQuestion: string;
  lastAnswer: string;

  category: string;
  budget: number | null;

  wantsStrong: boolean;
  wantsLowThc: boolean;

  recommendations: InventoryProduct[];

  selectedProduct: InventoryProduct | null;
};

const emptyMemory: ConversationMemory = {
  lastQuestion: "",
  lastAnswer: "",

  category: "",

  budget: null,

  wantsStrong: false,
  wantsLowThc: false,

  recommendations: [],

  selectedProduct: null,
};

export function useConversation() {
  const [memory, setMemory] = useState<ConversationMemory>(emptyMemory);

  function resetConversation() {
    setMemory(emptyMemory);
  }

  function updateConversation(update: Partial<ConversationMemory>) {
    setMemory((previous) => ({
      ...previous,
      ...update,
    }));
  }

  return {
    memory,
    updateConversation,
    resetConversation,
  };
}
