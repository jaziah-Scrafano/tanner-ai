import { getKnowledgeForProduct } from "./productknowledge";
import { detectCustomerIntent } from "../lib/intentengine";

export type InventoryProduct = {
  sku: string;
  product: string;
  category: string;
  tags: string;
  strain: string;
  vendor: string;
  room: string;
  available: number;
  price: number;
  expirationDate: string;
  flowerEquiv: string;
  imageUrl: string;
  thc: number;
  thca: number;
  cbd: number;
  calculatedThcMg: number;
};

export type Recommendation = {
  product: InventoryProduct;
  score: number;
  reasons: string[];
};

function cleanText(value: string) {
  return (
    value
      ?.replace(/^="/, "")
      .replace(/"$/, "")
      .replace(/^=/, "")
      .replace(/"/g, "")
      .trim() || ""
  );
}

function cleanNumber(value: string) {
  if (!value) return 0;

  const cleaned = cleanText(value)
    .replace("$", "")
    .replace("%", "")
    .replace("mg/g", "")
    .replace("mg", "")
    .replace("g", "")
    .replace(",", "")
    .trim();

  const number = parseFloat(cleaned);
  return Number.isNaN(number) ? 0 : number;
}

function parseCSVLine(line: string) {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (const char of line) {
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export async function loadInventory(): Promise<InventoryProduct[]> {
  const response = await fetch("/inventory.csv");

  if (!response.ok) {
    throw new Error("inventory.csv not found");
  }

  const text = await response.text();
  const lines = text.trim().split(/\r?\n/);

  if (!lines.length) return [];

  const headers = parseCSVLine(lines[0]).map((header) =>
    cleanText(header.replace("\uFEFF", ""))
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    return {
      sku: cleanText(row["SKU"]),
      product: cleanText(row["Product"]),
      category: cleanText(row["Category"]),
      tags: cleanText(row["Tags"]),
      strain: cleanText(row["Strain"]),
      vendor: cleanText(row["Vendor"]),
      room: cleanText(row["Room"]),
      available: cleanNumber(row["Available"]),
      price: cleanNumber(row["Current price"]),
      expirationDate: cleanText(row["Expiration date"]),
      flowerEquiv: cleanText(row["Flower equiv"]),
      imageUrl: cleanText(row["Image URL"]),
      thc: cleanNumber(row["THC"]),
      thca: cleanNumber(row["THCA"]),
      cbd: cleanNumber(row["CBD"]),
      calculatedThcMg: cleanNumber(row["Calculated THC (mg)"]),
    };
  });
}

export function getPotency(product: InventoryProduct) {
  return Math.max(product.thc, product.thca);
}

function getSearchText(product: InventoryProduct) {
  return `
    ${product.product}
    ${product.category}
    ${product.tags}
    ${product.vendor}
    ${product.strain}
  `.toLowerCase();
}

function productMatchesCategory(product: InventoryProduct, category: string) {
  const text = getSearchText(product);

  if (!category) return true;

  if (category === "flower") return text.includes("flower");

  if (category === "vape") {
    return (
      text.includes("vape") ||
      text.includes("cart") ||
      text.includes("cartridge") ||
      text.includes("disposable")
    );
  }

  if (category === "edible") {
    return (
      text.includes("edible") ||
      text.includes("gummy") ||
      text.includes("gummies") ||
      text.includes("chocolate") ||
      text.includes("drink")
    );
  }

  if (category === "preroll") {
    return (
      text.includes("pre-roll") ||
      text.includes("preroll") ||
      text.includes("pre roll") ||
      text.includes("joint")
    );
  }

  if (category === "concentrate") {
    return (
      text.includes("concentrate") ||
      text.includes("wax") ||
      text.includes("rosin") ||
      text.includes("resin") ||
      text.includes("hash") ||
      text.includes("dab")
    );
  }

  return true;
}

function isCannabisProduct(product: InventoryProduct) {
  const text = getSearchText(product);

  return !(
    text.includes("shirt") ||
    text.includes("hoodie") ||
    text.includes("battery") ||
    text.includes("lighter") ||
    text.includes("papers") ||
    text.includes("merch") ||
    text.includes("apparel") ||
    text.includes("accessory")
  );
}

function scoreProduct(product: InventoryProduct, question: string): Recommendation {
  const intent = detectCustomerIntent(question);
  const searchable = getSearchText(product);
  const potency = getPotency(product);
  const knowledge = getKnowledgeForProduct(product.product);

  let score = 0;
  const reasons: string[] = [];

  if (product.available <= 0) {
    return { product, score: -9999, reasons: ["Not available"] };
  }

  if (!isCannabisProduct(product)) {
    return { product, score: -9999, reasons: ["Excluded non-cannabis item"] };
  }

  if (!productMatchesCategory(product, intent.category)) {
    return { product, score: -9999, reasons: ["Wrong category"] };
  }

  score += 20;
  reasons.push("In stock");

  if (intent.category) {
    score += 60;
    reasons.push(`Matches ${intent.category} request`);
  }

  if (intent.thc === "high" && potency > 0) {
    score += potency * 3;
    reasons.push(`High potency: ${potency}%`);
  }

  if (intent.thc === "low" && potency > 0) {
    if (potency <= 20) {
      score += 90;
      reasons.push(`Low potency: ${potency}%`);
    } else if (potency <= 25) {
      score += 50;
      reasons.push(`Moderate potency: ${potency}%`);
    } else {
      score -= potency * 2;
      reasons.push("Higher than requested potency");
    }
  }

  if (intent.thc === "balanced" && potency > 0) {
    if (potency >= 20 && potency <= 30) {
      score += 60;
      reasons.push(`Balanced potency: ${potency}%`);
    } else {
      score -= 20;
    }
  }

  if (intent.budget !== null) {
    if (product.price > 0 && product.price <= intent.budget) {
      score += 45;
      reasons.push(`Under $${intent.budget}`);
    } else {
      score -= 60;
    }
  }

  if (intent.wantsBudget && product.price > 0) {
    score += Math.max(0, 60 - product.price);
    reasons.push("Budget-aware");
  }

  if (knowledge) {
    score += 10;
    reasons.push("Enhanced product knowledge");

    if (intent.wantsSleep) {
      score += knowledge.sleepScore * 6;
      reasons.push(`Sleep score: ${knowledge.sleepScore}/10`);
    }

    if (intent.wantsRelax) {
      score += knowledge.relaxScore * 6;
      reasons.push(`Relax score: ${knowledge.relaxScore}/10`);
    }

    if (intent.wantsEnergy) {
      score += knowledge.energyScore * 6;
      reasons.push(`Energy score: ${knowledge.energyScore}/10`);
    }

    if (intent.wantsCreativity) {
      score += knowledge.creativityScore * 6;
      reasons.push(`Creativity score: ${knowledge.creativityScore}/10`);
    }

    if (intent.wantsAnxietyFriendly && knowledge.anxietyFriendly) {
      score += 45;
      reasons.push("Anxiety-friendly");
    }

    if (intent.wantsBeginner && knowledge.beginnerFriendly) {
      score += 45;
      reasons.push("Beginner-friendly");
    } else if (intent.wantsBeginner && potency > 28) {
      score -= 40;
      reasons.push("May be strong for beginners");
    }
  }

  if (intent.flavor && searchable.includes(intent.flavor.toLowerCase())) {
    score += 35;
    reasons.push(`Flavor match: ${intent.flavor}`);
  }

  if (intent.terpene && searchable.includes(intent.terpene.toLowerCase())) {
    score += 35;
    reasons.push(`Terpene match: ${intent.terpene}`);
  }

  for (const word of intent.originalQuestion
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2)) {
    if (searchable.includes(word)) score += 8;
  }

  return { product, score, reasons };
}

export function findTopProducts(
  products: InventoryProduct[],
  question: string,
  limit = 3
): Recommendation[] {
  const intent = detectCustomerIntent(question);

  const scored = products
    .map((product) => scoreProduct(product, question))
    .filter((item) => item.score > 0);

  if (intent.thc === "high") {
    return scored
      .filter((item) => getPotency(item.product) > 0)
      .sort((a, b) => getPotency(b.product) - getPotency(a.product))
      .slice(0, limit);
  }

  if (intent.thc === "low") {
    return scored
      .filter((item) => getPotency(item.product) > 0)
      .sort((a, b) => getPotency(a.product) - getPotency(b.product))
      .slice(0, limit);
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
