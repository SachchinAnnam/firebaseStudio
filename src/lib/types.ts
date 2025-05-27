export interface NutritionData {
  protein: number; // grams
  carbohydrates: number; // grams
  fats: number; // grams
  fiber: number; // grams
  calories: number; // kcal
  // Placeholder for more detailed nutrients if an API becomes available
  // vitamins?: { [key: string]: string };
  // minerals?: { [key: string]: string };
}

export interface FoodItem {
  id: string; // Usually the food name, can be an actual ID if from a DB
  name: string;
  nutrition: NutritionData;
  giIndex?: number;
  giExplanation?: string;
  summary?: string; // Nutritional summary
}
