import {
  findSimilarProducts,
  getEffects,
  getFlavors,
  getGoodFor,
  getTerpenes,
} from "../data/productknowledge";

import type { InventoryProduct } from "../data/inventory";

export function answerKnowledgeQuestion(
  question: string,
  inventory: InventoryProduct[]
) {
  const q = question.toLowerCase();

  if (q.includes("similar") || q.includes("like") || q.includes("closest")) {
    return answerSimilar(q, inventory);
  }

  if (
    q.includes("flavor") ||
    q.includes("taste") ||
    q.includes("fruity") ||
    q.includes("fruit") ||
    q.includes("berry") ||
    q.includes("sweet") ||
    q.includes("candy") ||
    q.includes("gas") ||
    q.includes("gassy") ||
    q.includes("citrus") ||
    q.includes("orange") ||
    q.includes("funky")
  ) {
    return answerFlavor(q, inventory);
  }

  if (
    q.includes("terpene") ||
    q.includes("limonene") ||
    q.includes("myrcene") ||
    q.includes("caryophyllene") ||
    q.includes("pinene") ||
    q.includes("linalool")
  ) {
    return answerTerpene(q, inventory);
  }

  if (
    q.includes("good for") ||
    q.includes("best for") ||
    q.includes("sleep") ||
    q.includes("stress") ||
    q.includes("movies") ||
    q.includes("relax") ||
    q.includes("creative") ||
    q.includes("gaming") ||
    q.includes("music")
  ) {
    return answerEffects(q, inventory);
  }

  return null;
}

function getInStockMatches(
  inventory: InventoryProduct[],
  matcher: (product: InventoryProduct) => boolean
) {
  return inventory.filter((product) => product.available > 0 && matcher(product));
}

function productText(product: InventoryProduct) {
  return `${product.product} ${product.vendor} ${product.category} ${product.tags} ${product.strain}`.toLowerCase();
}

function formatProduct(product: InventoryProduct, index: number) {
  return `${index + 1}. ${product.product} by ${
    product.vendor || "Unknown Vendor"
  } — $${product.price}`;
}

function findMentionedProduct(question: string, inventory: InventoryProduct[]) {
  return inventory.find((product) => {
    const name = product.product.toLowerCase();
    if (question.includes(name)) return true;

    return name
      .split(" ")
      .filter((word) => word.length > 4)
      .some((word) => question.includes(word));
  });
}

function answerSimilar(question: string, inventory: InventoryProduct[]) {
  const mentioned = findMentionedProduct(question, inventory);
  if (!mentioned) return null;

  const similarNames = findSimilarProducts(mentioned.product);
  if (!similarNames.length) return null;

  const matches = getInStockMatches(inventory, (product) => {
    const name = product.product.toLowerCase();
    return similarNames.some((similar) => name.includes(similar.toLowerCase()));
  }).slice(0, 3);

  if (!matches.length) return null;

  return `If you like ${mentioned.product}, I’d look at:

${matches.map(formatProduct).join("\n")}`;
}

function answerFlavor(question: string, inventory: InventoryProduct[]) {
  const flavorGroups: Record<string, string[]> = {
    fruity: ["fruit", "fruity", "berry", "citrus", "orange", "sweet", "candy"],
    fruit: ["fruit", "fruity", "berry", "citrus", "orange", "sweet", "candy"],
    berry: ["berry"],
    sweet: ["sweet", "candy"],
    candy: ["candy", "sweet"],
    gas: ["gas", "gassy"],
    gassy: ["gas", "gassy"],
    earthy: ["earthy"],
    citrus: ["citrus", "orange"],
    orange: ["orange", "citrus"],
    funky: ["funky"],
  };

  const wantedKey = Object.keys(flavorGroups).find((flavor) =>
    question.includes(flavor)
  );

  if (!wantedKey) return null;

  const wantedFlavors = flavorGroups[wantedKey];

  const matches = getInStockMatches(inventory, (product) => {
    const text = productText(product);

    const flavors = getFlavors(product.product).map((item) =>
      item.toLowerCase()
    );

    return (
      flavors.some((flavor) =>
        wantedFlavors.some((wanted) => flavor.includes(wanted))
      ) || wantedFlavors.some((wanted) => text.includes(wanted))
    );
  }).slice(0, 3);

  if (!matches.length) return null;

  return `For ${wantedKey} flavor, I’d look at:

${matches.map(formatProduct).join("\n")}`;
}

function answerTerpene(question: string, inventory: InventoryProduct[]) {
  const terpenes = ["myrcene", "limonene", "caryophyllene", "pinene", "linalool"];
  const wantedTerpene = terpenes.find((terpene) => question.includes(terpene));

  if (!wantedTerpene) return null;

  const matches = getInStockMatches(inventory, (product) =>
    getTerpenes(product.product).some((terpene) =>
      terpene.name.toLowerCase().includes(wantedTerpene)
    )
  ).slice(0, 3);

  if (!matches.length) return null;

  return `For ${wantedTerpene}, I’d look at:

${matches.map(formatProduct).join("\n")}`;
}

function answerEffects(question: string, inventory: InventoryProduct[]) {
  const effectWords = [
    "sleep",
    "stress",
    "movies",
    "relaxing",
    "relax",
    "creative",
    "gaming",
    "music",
    "social",
    "daytime",
    "evening",
  ];

  const wantedEffect = effectWords.find((effect) => question.includes(effect));
  if (!wantedEffect) return null;

  const matches = getInStockMatches(inventory, (product) => {
    const goodFor = getGoodFor(product.product).map((item) =>
      item.toLowerCase()
    );

    const effects = getEffects(product.product).map((item) =>
      item.toLowerCase()
    );

    const text = productText(product);

    return (
      goodFor.some((item) => item.includes(wantedEffect)) ||
      effects.some((item) => item.includes(wantedEffect)) ||
      text.includes(wantedEffect)
    );
  }).slice(0, 3);

  if (!matches.length) return null;

  return `For ${wantedEffect}, I’d look at:

${matches.map(formatProduct).join("\n")}`;
}
