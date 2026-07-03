import { getPotency, type InventoryProduct } from "../data/inventory";

export function formatMoney(value: number) {
  return value > 0 ? `$${value}` : "price not listed";
}

export function formatPotency(product: InventoryProduct) {
  const potency = getPotency(product);
  return potency ? `${potency}% THC/THCA` : "potency not listed";
}

export function describeProduct(product: InventoryProduct) {
  return `${product.product} by ${product.vendor || "Unknown Vendor"}

Category: ${product.category || "Unknown"}
Strain: ${product.strain || "Unknown"}
Potency: ${formatPotency(product)}
Price: ${formatMoney(product.price)}
Available: ${product.available}`;
}

export function buildRecommendationReply(products: InventoryProduct[]) {
  if (!products.length) {
    return "I couldn’t find a strong in-stock match for that.";
  }

  const top = products[0];

  return `I’d start with ${top.product} by ${top.vendor || "Unknown Vendor"}.

It’s a ${top.category || "cannabis product"}${
    top.strain ? ` listed as ${top.strain}` : ""
  }, priced at ${formatMoney(top.price)}, with ${top.available} available.

The listed potency is ${formatPotency(top)}.

Two other options:
${products
  .slice(1)
  .map(
    (product, index) =>
      `${index + 2}. ${product.product} — ${formatPotency(
        product
      )}, ${formatMoney(product.price)}`
  )
  .join("\n")}

Confirm availability with staff before purchase.`;
}

export function answerFromMemory(
  question: string,
  products: InventoryProduct[]
) {
  const q = question.toLowerCase();

  if (!products.length) return null;

  if (q.includes("second")) return describeProduct(products[1]);
  if (q.includes("third")) return describeProduct(products[2]);
  if (q.includes("first")) return describeProduct(products[0]);

  if (q.includes("strongest") || q.includes("stronger")) {
    const top = [...products].sort((a, b) => getPotency(b) - getPotency(a))[0];
    return `Out of those, ${top.product} is the strongest at ${formatPotency(
      top
    )}.`;
  }

  if (q.includes("weakest") || q.includes("weaker") || q.includes("low thc")) {
    const top = [...products]
      .filter((product) => getPotency(product) > 0)
      .sort((a, b) => getPotency(a) - getPotency(b))[0];

    if (!top) return null;

    return `Out of those, ${top.product} is the lowest potency at ${formatPotency(
      top
    )}.`;
  }

  if (q.includes("cheapest") || q.includes("cheaper")) {
    const top = [...products]
      .filter((product) => product.price > 0)
      .sort((a, b) => a.price - b.price)[0];

    if (!top) return null;

    return `Out of those, ${top.product} is the cheapest at ${formatMoney(
      top.price
    )}.`;
  }

  if (q.includes("sleep") || q.includes("night")) {
    const top = products.find((product) =>
      `${product.product} ${product.strain} ${product.tags}`
        .toLowerCase()
        .includes("pink")
    );

    if (top) {
      return `Out of the products we were discussing, I’d lean toward ${top.product} for sleep or nighttime use.`;
    }

    return `Out of those, I’d choose ${products[0].product} as the best fit for sleep based on the current options.`;
  }

  return null;
}
