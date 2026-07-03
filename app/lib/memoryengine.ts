import type { InventoryProduct } from "../data/inventory";

export type ConversationMemory = {
  lastQuestion: string;
  lastAnswer: string;
  lastCategory: string;
  lastRecommendations: InventoryProduct[];
  selectedProduct: InventoryProduct | null;
};

export const emptyMemory: ConversationMemory = {
  lastQuestion: "",
  lastAnswer: "",
  lastCategory: "",
  lastRecommendations: [],
  selectedProduct: null,
};

export function detectCategory(question: string) {
  const q = question.toLowerCase();

  if (q.includes("flower") || q.includes("bud") || q.includes("eighth")) {
    return "flower";
  }

  if (q.includes("edible") || q.includes("gummy") || q.includes("gummies")) {
    return "edible";
  }

  if (q.includes("vape") || q.includes("cart") || q.includes("cartridge")) {
    return "vape";
  }

  if (q.includes("pre-roll") || q.includes("preroll") || q.includes("joint")) {
    return "pre-roll";
  }

  if (
    q.includes("concentrate") ||
    q.includes("wax") ||
    q.includes("rosin") ||
    q.includes("resin") ||
    q.includes("hash")
  ) {
    return "concentrate";
  }

  return "";
}

export function isFollowUpQuestion(question: string) {
  const q = question.toLowerCase();

  return (
    q.includes("which") ||
    q.includes("out of") ||
    q.includes("those") ||
    q.includes("the first") ||
    q.includes("the second") ||
    q.includes("the third") ||
    q.includes("stronger") ||
    q.includes("weakest") ||
    q.includes("cheapest") ||
    q.includes("sleep") ||
    q.includes("fruity") ||
    q.includes("relax")
  );
}

export function pickOrdinalProduct(
  question: string,
  products: InventoryProduct[]
) {
  const q = question.toLowerCase();

  if (q.includes("first")) return products[0] || null;
  if (q.includes("second")) return products[1] || null;
  if (q.includes("third")) return products[2] || null;

  return null;
}
