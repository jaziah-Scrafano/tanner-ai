import { getKnowledgeForProduct } from "./productknowledge";

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
		if (char === '"') insideQuotes = !insideQuotes;
		else if (char === "," && !insideQuotes) {
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
	const headers = parseCSVLine(lines[0]).map((h) =>
		cleanText(h.replace("\uFEFF", ""))
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

function includesAny(text: string, words: string[]) {
	return words.some((word) => text.includes(word));
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

function isFlower(product: InventoryProduct) {
	return getSearchText(product).includes("flower");
}

function isVape(product: InventoryProduct) {
	const text = getSearchText(product);
	return (
		text.includes("vape") ||
		text.includes("cart") ||
		text.includes("cartridge")
	);
}

function isEdible(product: InventoryProduct) {
	return getSearchText(product).includes("edible");
}

function isPreroll(product: InventoryProduct) {
	const text = getSearchText(product);
	return (
		text.includes("pre-roll") ||
		text.includes("preroll") ||
		text.includes("joint")
	);
}

function isConcentrate(product: InventoryProduct) {
	const text = getSearchText(product);
	return (
		text.includes("concentrate") ||
		text.includes("wax") ||
	text.includes("rosin") ||
	text.includes("resin") ||
	text.includes("hash") ||
		text.includes("dab")
	);
}

function getBudgetLimit(text: string) {
	const match =
		text.match(/under\s?\$?(\d+)/) ||
		text.match(/less than\s?\$?(\d+)/) ||
		text.match(/max\s?\$?(\d+)/);

	return match ? Number(match[1]) : null;
}

function scoreProduct(product: InventoryProduct, question: string): Recommendation {
	const text = question.toLowerCase();
	const searchable = getSearchText(product);
	const potency = getPotency(product);
	const knowledge = getKnowledgeForProduct(product.product);
	const budgetLimit = getBudgetLimit(text);

	const wantsFlower = includesAny(text, [
	"flower",
	"bud",
	"eighth",
	"3.5",
	"quarter",
	"ounce",
	]);

	const wantsVape = includesAny(text, [
	"vape",
	"cart",
	"cartridge",
		"disposable",
	]);

	const wantsEdible = includesAny(text, [
		"edible",
		"gummy",
		"gummies",
		"chocolate",
	]);

	const wantsPreroll = includesAny(text, [
		"pre roll",
		"pre-roll",
		"preroll",
		"joint",
	]);

	const wantsConcentrate = includesAny(text, [
		"concentrate",
		"wax",
		"rosin",
		"resin",
		"hash",
		"dab",
	]);

	const wantsStrong = includesAny(text, [
		"strong",
		"strongest",
		"high thc",
		"highest thc",
		"potent",
	]);

	const wantsLow = includesAny(text, [
		"weak",
		"weakest",
		"low thc",
		"lowest thc",
		"mild",
		"not strong",
		"low potency",
	]);

	const wantsBudget = includesAny(text, [
		"cheap",
		"deal",
		"budget",
		"sale",
		"affordable",
		"under",
	]);

	const wantsSleep = includesAny(text, ["sleep", "night", "bed"]);
	const wantsRelax = includesAny(text, ["relax", "relaxing", "calm", "chill", "stress"]);
	const wantsEnergy = includesAny(text, ["energy", "focus", "daytime", "productive"]);
	const wantsCreativity = includesAny(text, ["creative", "gaming", "music", "art"]);
	const wantsAnxiety = includesAny(text, ["anxiety", "nervous", "panic", "paranoid"]);
	const wantsBeginner = includesAny(text, ["beginner", "new", "first time", "low tolerance"]);

	let score = 0;
	const reasons: string[] = [];

	if (product.available <= 0) {
		return { product, score: -9999, reasons: ["Not available"] };
	}

	if (wantsFlower && !isFlower(product)) {
		return { product, score: -9999, reasons: ["Not flower"] };
	}

	if (wantsVape && !isVape(product)) {
		return { product, score: -9999, reasons: ["Not vape/cart"] };
	}

	if (wantsEdible && !isEdible(product)) {
		return { product, score: -9999, reasons: ["Not edible"] };
	}

	if (wantsPreroll && !isPreroll(product)) {
		return { product, score: -9999, reasons: ["Not pre-roll"] };
	}

	if (wantsConcentrate && !isConcentrate(product)) {
		return { product, score: -9999, reasons: ["Not concentrate"] };
	}
	score += 20;
	reasons.push("In stock");

	if (wantsFlower) {
		score += 60;
		reasons.push("Matches flower request");
	}

	if (wantsVape || wantsEdible || wantsPreroll || wantsConcentrate) {
		score += 60;
		reasons.push("Matches requested category");
	}

	if (wantsStrong && potency > 0) {
		score += potency * 3;
		reasons.push(`High potency: ${potency}%`);
	}

	if (wantsLow && potency > 0) {
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

	if (budgetLimit !== null) {
		if (product.price > 0 && product.price <= budgetLimit) {
			score += 45;
			reasons.push(`Under $${budgetLimit}`);
		} else {
			score -= 60;
		}
	}

	if (wantsBudget && product.price > 0) {
		score += Math.max(0, 60 - product.price);
		reasons.push("Budget-aware");
	}

	if (knowledge) {
		score += 10;

		if (wantsSleep) score += knowledge.sleepScore * 6;
		if (wantsRelax) score += knowledge.relaxScore * 6;
		if (wantsEnergy) score += knowledge.energyScore * 6;
		if (wantsCreativity) score += knowledge.creativityScore * 6;

		if (wantsAnxiety && knowledge.anxietyFriendly) {
			score += 45;
			reasons.push("Anxiety-friendly");
		}

		if (wantsBeginner && knowledge.beginnerFriendly) {
			score += 45;
			reasons.push("Beginner-friendly");
		} else if (wantsBeginner && potency > 28) {
			score -= 40;
			reasons.push("May be strong for beginners");
		}
	}

	for (const word of text.split(/\s+/).filter((w) => w.length > 2)) {
		if (searchable.includes(word)) score += 8;
	}

	return { product, score, reasons };
}

export function findTopProducts(
	products: InventoryProduct[],
	question: string,
	limit = 3
): Recommendation[] {
	return products
		.map((product) => scoreProduct(product, question))
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit);
}

