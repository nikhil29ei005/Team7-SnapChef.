
export interface Ingredient {
  name: string;
  quantity: string;
}

export interface NutritionInfo {
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
}

export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  macros: NutritionInfo;
}

export interface SnapChefResult {
  identifiedIngredients: string[];
  nutritionalEstimate: string;
  suggestedRecipe: Recipe;
}
