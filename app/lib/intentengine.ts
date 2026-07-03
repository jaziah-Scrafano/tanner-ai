
export type ProductCategory =
	| "flower"
	| "vape"
	| "edible"
	| "preroll"
	| "concentrate"
	| "";

export type ThcPreference = "high" | "low" | "balanced" | "";

export type CustomerIntent = {
	category: ProductCategory;
	thc: ThcPreference;
	budget: number | null;

	wantsSleep: boolean;
	wantsRelax: boolean;
	wantsEnergy: boolean;
	wantsCreativity: boolean;
	wantsAnxietyFriendly: boolean;
	wantsBeginner: boolean;

	flavor: string;
	terpene: string;

	originalQuestion: string;
};

function includesAny(text: string, words: string[]) {
	return words.some((word) => text.includes(word));
}

function detectBudget(text: string) {
	const match =
		text.match(/under\s?\$?(\d+)/) ||
		text.match(/less than\s?\$?(\d+)/) ||
		text.match(/max\s?\$?(\d+)/) ||
		text.match(/below\s?\$?(\d+)/);

	return match ? Number(match[1]) : null;
}

function detectCategory(text: string): ProductCategory {
	if (includesAny(text, ["flower", "bud", "eighth", "3.5", "quarter", "ounce"])) {
		return "flower";
	}

	if (includesAny(text, ["vape", "cart", "cartridge", "disposable"])) {
		return "vape";
	}

	if (includesAny(text, ["edible", "gummy", "gummies", "chocolate", "drink"])) {
		return "edible";
	}

	if (includesAny(text, ["pre roll", "pre-roll", "preroll", "joint"])) {
		return "preroll";
	}

	if (includesAny(text, ["concentrate", "wax", "rosin", "resin", "hash", "dab"])) {
		return "concentrate";
	}

	return "";
}

function detectThc(text: string): ThcPreference {
	if (
		includesAny(text, [
			"strong",
			"strongest",
			"high thc",
			"highest thc",
			"potent",
			"smacked",
			"heavy hitter",
		])
	) {
		return "high";
	}

	if (
		includesAny(text, [
			"weak",
			"weakest",
			"low thc",
			"lowest thc",
			"mild",
			"not strong",
			"less strong",
			"low potency",
			"lower thc",
			"beginner",
			"first time",
			"low tolerance",
		])
	) {
		return "low";
	}

	if (includesAny(text, ["balanced", "middle", "moderate", "not too strong"])) {
		return "balanced";
	}

	return "";
}

function detectFlavor(text: string) {
	const flavors = [
		"fruity",
		"fruit",
		"berry",
		"sweet",
		"candy",
		"gas",
		"gassy",
		"earthy",
		"citrus",
		"orange",
		"funky",
		"lemon",
		"cream",
		"vanilla",
	];

	return flavors.find((flavor) => text.includes(flavor)) || "";
}

function detectTerpene(text: string) {
	const terpenes = [
		"myrcene",
		"limonene",
		"caryophyllene",
		"pinene",
		"linalool",
		"terpinolene",
		"humulene",
	];

	return terpenes.find((terpene) => text.includes(terpene)) || "";
}

export function detectCustomerIntent(question: string): CustomerIntent {
	const text = question.toLowerCase();

	return {
		category: detectCategory(text),
		thc: detectThc(text),
		budget: detectBudget(text),

		wantsSleep: includesAny(text, ["sleep", "night", "bed", "insomnia", "knock out"]),
		wantsRelax: includesAny(text, ["relax", "relaxing", "calm", "chill", "stress", "after work"]),
		wantsEnergy: includesAny(text, ["energy", "focus", "daytime", "productive", "hiking", "active"]),
		wantsCreativity: includesAny(text, ["creative", "creativity", "gaming", "music", "art", "drawing", "xbox", "playstation"]),
		wantsAnxietyFriendly: includesAny(text, ["anxiety", "nervous", "panic", "paranoid", "overthink"]),
		wantsBeginner: includesAny(text, ["beginner", "new", "first time", "low tolerance"]),

		flavor: detectFlavor(text),
		terpene: detectTerpene(text),

		originalQuestion: question,
	};
}
