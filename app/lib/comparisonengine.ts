import { getPotency, type InventoryProduct } from "../data/inventory";
import {
  getEffects,
  getFlavors,
  getGoodFor,
  getKnowledgeForProduct,
  getTerpenes,
} from "../data/productknowledge";
import { formatMoney, formatPotency } from "./responseengine";

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, " ");
}

function findProductByName(name: string, inventory: InventoryProduct[]) {
  const target = normalize(name);

  return inventory.find((product) => {
    const productName = normalize(product.product);
    const strain = normalize(product.strain);

    return productName.includes(target) || strain.includes(target);
  });
}

function extractComparisonNames(question: string) {
  const q = question.toLowerCase();

  if (q.includes(" vs ")) {
    return q.split(" vs ").map((part) => part.replace("compare", "").trim());
  }

  if (q.includes(" versus ")) {
    return q.split(" versus ").map((part) => part.replace("compare", "").trim());
  }

  if (q.includes(" to ")) {
    return q.split(" to ").map((part) => part.replace("compare", "").trim());
  }

  if (q.includes(" and ")) {
    return q.split(" and ").map((part) => part.replace("compare", "").trim());
  }

  return [];
}

export function isComparisonQuestion(question: string) {
  const q = question.toLowerCase();

  return (
    q.includes("compare") ||
    q.includes(" vs ") ||
    q.includes(" versus ") ||
    q.includes("which is better")
  );
}

export function answerComparisonQuestion(
  question: string,
  inventory: InventoryProduct[],
  previousProducts: InventoryProduct[]
) {
  const q = question.toLowerCase();

  let first: InventoryProduct | null = null;
  let second: InventoryProduct | null = null;

  if (q.includes("first")) first = previousProducts[0] || null;
  if (q.includes("second")) {
    if (!first) first = previousProducts[1] || null;
    else second = previousProducts[1] || null;
  }
  if (q.includes("third")) second = previousProducts[2] || null;

  if (!first || !second) {
    const names = extractComparisonNames(question);

    if (names.length >= 2) {
      first = findProductByName(names[0], inventory) || first;
      second = findProductByName(names[1], inventory) || second;
    }
  }

  if (!first || !second) {
    return null;
  }

  const firstKnowledge = getKnowledgeForProduct(first.product);
  const secondKnowledge = getKnowledgeForProduct(second.product);

  const firstPotency = getPotency(first);
  const secondPotency = getPotency(second);

  const stronger =
    firstPotency > secondPotency
      ? first.product
      : secondPotency > firstPotency
      ? second.product
      : "They are about even on listed potency";

  const cheaper =
    first.price < second.price
      ? first.product
      : second.price < first.price
      ? second.product
      : "They are the same price";

  return `Comparison: ${first.product} vs ${second.product}

1. ${first.product}
Vendor: ${first.vendor || "Unknown Vendor"}
Category: ${first.category || "Unknown"}
Strain: ${first.strain || "Unknown"}
Potency: ${formatPotency(first)}
Price: ${formatMoney(first.price)}
Available: ${first.available}
Effects: ${getEffects(first.product).join(", ") || "Not listed"}
Flavors: ${getFlavors(first.product).join(", ") || "Not listed"}
Terpenes: ${
    getTerpenes(first.product)
      .map((terpene) => terpene.name)
      .join(", ") || "Not listed"
  }
Best for: ${getGoodFor(first.product).join(", ") || "Not listed"}

2. ${second.product}
Vendor: ${second.vendor || "Unknown Vendor"}
Category: ${second.category || "Unknown"}
Strain: ${second.strain || "Unknown"}
Potency: ${formatPotency(second)}
Price: ${formatMoney(second.price)}
Available: ${second.available}
Effects: ${getEffects(second.product).join(", ") || "Not listed"}
Flavors: ${getFlavors(second.product).join(", ") || "Not listed"}
Terpenes: ${
    getTerpenes(second.product)
      .map((terpene) => terpene.name)
      .join(", ") || "Not listed"
  }
Best for: ${getGoodFor(second.product).join(", ") || "Not listed"}

Quick take:
Stronger: ${stronger}
Cheaper: ${cheaper}

My recommendation:
${
  firstKnowledge || secondKnowledge
    ? "If you want the better fit, I'd choose based on the experience you want: Pink Ink leans heavier/relaxing, while Super Boof leans more creative, citrusy, and social."
    : "I'd choose based on potency, price, and the product type since detailed knowledge is limited for one or both products."
}`;
}