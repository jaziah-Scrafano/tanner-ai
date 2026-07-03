export type TerpeneInfo = {
  name: string;
  amount?: number;
};

export type ProductKnowledge = {
  aliases: string[];
  genetics?: string;
  strainType: "Indica" | "Sativa" | "Hybrid" | "Unknown";
  effects: string[];
  flavors: string[];
  terpenes: TerpeneInfo[];
  goodFor: string[];
  avoidIf: string[];
  comparableTo: string[];
  sleepScore: number;
  relaxScore: number;
  energyScore: number;
  creativityScore: number;
  anxietyFriendly: boolean;
  beginnerFriendly: boolean;
};

export const productKnowledge: ProductKnowledge[] = [
  {
    aliases: ["pink ink"],
    genetics: "Unknown",
    strainType: "Hybrid",
    effects: ["relaxed", "euphoric", "heavy", "calm"],
    flavors: ["berry", "sweet", "gas"],
    terpenes: [
      { name: "myrcene" },
      { name: "caryophyllene" },
      { name: "limonene" },
    ],
    goodFor: ["evening", "relaxing", "movies", "stress relief", "night"],
    avoidIf: ["low tolerance", "need energy", "daytime productivity"],
    comparableTo: ["permanent marker", "scream pie"],
    sleepScore: 8,
    relaxScore: 9,
    energyScore: 3,
    creativityScore: 5,
    anxietyFriendly: false,
    beginnerFriendly: false,
  },
  {
    aliases: ["super boof", "superboof"],
    genetics: "Black Cherry Punch x Tropicana Cookies",
    strainType: "Hybrid",
    effects: ["creative", "happy", "uplifted", "relaxed"],
    flavors: ["citrus", "sweet", "funky", "orange"],
    terpenes: [
      { name: "limonene" },
      { name: "caryophyllene" },
      { name: "myrcene" },
    ],
    goodFor: ["creativity", "gaming", "music", "social", "daytime"],
    avoidIf: ["need sleep only", "very low tolerance"],
    comparableTo: ["tropicana cookies", "orange push pop", "super lemon haze"],
    sleepScore: 4,
    relaxScore: 7,
    energyScore: 7,
    creativityScore: 9,
    anxietyFriendly: true,
    beginnerFriendly: false,
  },
  {
    aliases: ["permanent marker", "permanent power"],
    genetics: "Biscotti x Sherb Bx x Jealousy",
    strainType: "Hybrid",
    effects: ["relaxed", "euphoric", "heavy", "balanced"],
    flavors: ["gas", "sweet", "earthy", "candy"],
    terpenes: [
      { name: "caryophyllene" },
      { name: "limonene" },
      { name: "myrcene" },
    ],
    goodFor: ["relaxing", "evening", "stress", "experienced users"],
    avoidIf: ["low tolerance", "need high energy"],
    comparableTo: ["pink ink", "scream pie", "gelato"],
    sleepScore: 7,
    relaxScore: 9,
    energyScore: 4,
    creativityScore: 6,
    anxietyFriendly: true,
    beginnerFriendly: false,
  },
];

export function getKnowledgeForProduct(productName: string) {
  const name = productName.toLowerCase();

  return (
    productKnowledge.find((product) =>
      product.aliases.some((alias) => name.includes(alias))
    ) || null
  );
}

export function findSimilarProducts(productName: string) {
  return getKnowledgeForProduct(productName)?.comparableTo ?? [];
}

export function getEffects(productName: string) {
  return getKnowledgeForProduct(productName)?.effects ?? [];
}

export function getFlavors(productName: string) {
  return getKnowledgeForProduct(productName)?.flavors ?? [];
}

export function getTerpenes(productName: string) {
  return getKnowledgeForProduct(productName)?.terpenes ?? [];
}

export function getGoodFor(productName: string) {
  return getKnowledgeForProduct(productName)?.goodFor ?? [];
}
