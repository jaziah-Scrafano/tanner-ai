import { findTopProducts, type InventoryProduct } from "../data/inventory";
import { answerKnowledgeQuestion } from "./knowledgeengine";
import {
  detectCategory,
  isFollowUpQuestion,
  type ConversationMemory,
} from "./memoryengine";
import { answerFromMemory, buildRecommendationReply } from "./responseengine";
import {
  answerComparisonQuestion,
  isComparisonQuestion,
} from "./comparisonengine";

export type ConversationResult = {
  answer: string;
  selectedProduct: InventoryProduct | null;
  recommendations: InventoryProduct[];
  category: string;
};

export function runConversationEngine({
  question,
  inventory,
  memory,
}: {
  question: string;
  inventory: InventoryProduct[];
  memory: ConversationMemory;
}): ConversationResult {
  const category = detectCategory(question) || memory.lastCategory;

  if (isFollowUpQuestion(question) && memory.lastRecommendations.length) {
    const memoryAnswer = answerFromMemory(question, memory.lastRecommendations);

    if (memoryAnswer) {
      return {
        answer: memoryAnswer,
        selectedProduct: memory.selectedProduct,
        recommendations: memory.lastRecommendations,
        category,
      };
    }
  }

  if (isComparisonQuestion(question)) {
    const comparisonAnswer = answerComparisonQuestion(
      question,
      inventory,
      memory.lastRecommendations
    );

    if (comparisonAnswer) {
      return {
        answer: comparisonAnswer,
        selectedProduct: memory.selectedProduct,
        recommendations: memory.lastRecommendations,
        category,
      };
    }
  }

  const knowledgeAnswer = answerKnowledgeQuestion(question, inventory);

  if (knowledgeAnswer) {
    return {
      answer: knowledgeAnswer,
      selectedProduct: memory.selectedProduct,
      recommendations: memory.lastRecommendations,
      category,
    };
  }

  const searchQuestion = category ? `${question} ${category}` : question;
  const matches = findTopProducts(inventory, searchQuestion, 3);
  const products = matches.map((match) => match.product);

  return {
    answer: buildRecommendationReply(products),
    selectedProduct: products[0] || null,
    recommendations: products,
    category,
  };
}
