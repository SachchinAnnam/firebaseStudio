"use client";

import { useState, useEffect, useCallback } from 'react';
import type { FoodItem, NutritionData } from '@/lib/types';
import { calculateGiIndex, type CalculateGiIndexInput } from '@/ai/flows/calculate-gi-index';
import Header from '@/components/layout/Header';
import FoodSearchForm from '@/components/FoodSearchForm';
import NutritionCard from '@/components/NutritionCard';
import SavedFoodsList from '@/components/SavedFoodsList';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

// Mock function to get nutrition data (protein, carbs, etc.)
// In a real app, this would come from a dedicated nutrition API
const getMockNutritionData = (foodName: string): NutritionData => {
  const foodNameLower = foodName.toLowerCase();
  const baseCalories = 50 + Math.random() * 200; // 50-250 calories
  
  // Simple predefined data for a few items
  if (foodNameLower.includes("apple")) {
    return { protein: 0.3, carbohydrates: 14, fats: 0.2, fiber: 2.4, calories: 52 };
  }
  if (foodNameLower.includes("banana")) {
    return { protein: 1.1, carbohydrates: 23, fats: 0.3, fiber: 2.6, calories: 89 };
  }
  if (foodNameLower.includes("chicken breast")) {
    return { protein: 31, carbohydrates: 0, fats: 3.6, fiber: 0, calories: 165 };
  }
  if (foodNameLower.includes("bread")) {
    return { protein: 9, carbohydrates: 49, fats: 3.2, fiber: 2.7, calories: 265 };
  }

  // Generic random data
  const protein = Math.random() * 30; // 0-30g
  const carbs = Math.random() * 50;   // 0-50g
  const fats = Math.random() * 20;    // 0-20g
  const fiber = Math.random() * 10;   // 0-10g
  
  return {
    protein: parseFloat(protein.toFixed(1)),
    carbohydrates: parseFloat(carbs.toFixed(1)),
    fats: parseFloat(fats.toFixed(1)),
    fiber: parseFloat(fiber.toFixed(1)),
    calories: parseFloat(baseCalories.toFixed(0)),
  };
};

const getMockSummary = (foodName: string, nutrition: NutritionData): string => {
  let summary = `${foodName} is a food item. `;
  if (nutrition.protein > 15) summary += "It's a good source of protein. ";
  if (nutrition.carbohydrates > 20) summary += "It provides significant carbohydrates for energy. ";
  if (nutrition.fiber > 3) summary += "Contains a decent amount of fiber. ";
  if (nutrition.calories > 200) summary += "It's relatively high in calories. ";
  else if (nutrition.calories < 100) summary += "It's relatively low in calories. ";
  return summary.trim();
};


export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFood, setCurrentFood] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFoods, setSavedFoods] = useLocalStorage<FoodItem[]>('nutrisleuth-savedFoods', []);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setError(null);
    setCurrentFood(null);

    try {
      const aiInput: CalculateGiIndexInput = { foodItem: query };
      const giResult = await calculateGiIndex(aiInput);
      
      const mockNutrition = getMockNutritionData(query);
      const mockSummary = getMockSummary(query, mockNutrition);

      const foodDetails: FoodItem = {
        id: query.toLowerCase().replace(/\s+/g, '-'), // Simple ID generation
        name: query,
        nutrition: mockNutrition,
        giIndex: giResult.giIndex,
        giExplanation: giResult.explanation,
        summary: mockSummary,
      };
      setCurrentFood(foodDetails);
      toast({
        title: "Search Successful",
        description: `Displaying information for ${query}.`,
      });
    } catch (err) {
      console.error("Error fetching GI index:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch GI Index or nutrition data.';
      setError(errorMessage);
      toast({
        title: "Search Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFood = (foodItem: FoodItem) => {
    if (!savedFoods.find(f => f.id === foodItem.id)) {
      setSavedFoods([...savedFoods, foodItem]);
      toast({
        title: "Food Saved!",
        description: `${foodItem.name} has been added to your saved list.`,
      });
    }
  };

  const handleUnsaveFood = (foodItemId: string) => {
    setSavedFoods(savedFoods.filter(f => f.id !== foodItemId));
    toast({
      title: "Food Removed",
      description: `The item has been removed from your saved list.`,
    });
  };

  const isFoodSaved = useCallback((foodItemId: string) => {
    return savedFoods.some(f => f.id === foodItemId);
  }, [savedFoods]);

  const handleSelectSavedFood = (foodItem: FoodItem) => {
    setCurrentFood(foodItem);
    setSearchQuery(foodItem.name); // Optionally update search query
    toast({
      title: `Selected ${foodItem.name}`,
      description: `Displaying details for your saved item.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <section className="lg:col-span-1 flex flex-col gap-6">
            <FoodSearchForm onSearch={handleSearch} isLoading={isLoading} />
            <SavedFoodsList 
              savedFoods={savedFoods}
              onSelectFood={handleSelectSavedFood}
              onRemoveFood={handleUnsaveFood}
            />
          </section>
          <section className="lg:col-span-2">
            <NutritionCard
              foodItem={currentFood}
              isLoading={isLoading}
              error={error}
              onSave={handleSaveFood}
              onUnsave={handleUnsaveFood}
              isSaved={isFoodSaved}
            />
          </section>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-8">
        <p>&copy; {new Date().getFullYear()} NutriSleuth. All rights reserved.</p>
        <p className="mt-1">Glycemic Index and nutritional information are estimates.</p>
      </footer>
    </div>
  );
}
