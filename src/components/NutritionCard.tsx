"use client";

import type { FC } from 'react';
import type { FoodItem, NutritionData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Info, Zap, FileText, Brain, Scale, Flame, Leaf as FiberIcon } from 'lucide-react'; // Using Leaf for Fiber
import { Progress } from '@/components/ui/progress';

interface NutritionCardProps {
  foodItem: FoodItem | null;
  isLoading: boolean;
  error: string | null;
  onSave: (foodItem: FoodItem) => void;
  onUnsave: (foodItemId: string) => void;
  isSaved: (foodItemId: string) => boolean;
}

const NutrientDisplay: FC<{ label: string; value: number; unit: string; icon?: React.ReactNode; progress?: number }> = ({ label, value, unit, icon, progress }) => (
  <div className="mb-3">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center">
        {icon && <span className="mr-2 text-primary">{icon}</span>}
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <span className="text-sm text-muted-foreground">{value.toFixed(1)} {unit}</span>
    </div>
    {progress !== undefined && <Progress value={progress} className="h-2 [&>div]:bg-primary" />}
  </div>
);


const NutritionCard: FC<NutritionCardProps> = ({ foodItem, isLoading, error, onSave, onUnsave, isSaved }) => {
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Fetching Nutrition Data...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="text-xl text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!foodItem) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">Welcome to NutriSleuth!</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <Info size={48} className="mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Search for a food item to see its nutritional information and Glycemic Index.</p>
        </CardContent>
      </Card>
    );
  }

  const { name, nutrition, giIndex, giExplanation, summary } = foodItem;
  const totalMacronutrients = nutrition.protein + nutrition.carbohydrates + nutrition.fats;


  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-primary">{name}</CardTitle>
            {summary && <CardDescription className="mt-1 text-foreground/80">{summary}</CardDescription>}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => isSaved(foodItem.id) ? onUnsave(foodItem.id) : onSave(foodItem)}
            aria-label={isSaved(foodItem.id) ? "Unsave food" : "Save food"}
            className="text-accent hover:text-accent/80"
          >
            <Heart size={24} fill={isSaved(foodItem.id) ? "currentColor" : "none"} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center"><Scale size={20} className="mr-2 text-primary"/>Macronutrients</h3>
            <NutrientDisplay label="Calories" value={nutrition.calories} unit="kcal" icon={<Flame size={16}/>} />
            <NutrientDisplay 
              label="Protein" 
              value={nutrition.protein} 
              unit="g" 
              icon={<Zap size={16}/>} 
              progress={totalMacronutrients > 0 ? (nutrition.protein / totalMacronutrients) * 100 : 0}
            />
            <NutrientDisplay 
              label="Carbohydrates" 
              value={nutrition.carbohydrates} 
              unit="g" 
              icon={<Brain size={16}/>}
              progress={totalMacronutrients > 0 ? (nutrition.carbohydrates / totalMacronutrients) * 100 : 0}
            />
            <NutrientDisplay 
              label="Fats" 
              value={nutrition.fats} 
              unit="g" 
              icon={<Zap size={16} />} // Using Zap again as generic energy icon
              progress={totalMacronutrients > 0 ? (nutrition.fats / totalMacronutrients) * 100 : 0}
            />
            <NutrientDisplay label="Fiber" value={nutrition.fiber} unit="g" icon={<FiberIcon size={16}/>}/>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center"><FileText size={20} className="mr-2 text-primary"/>Glycemic Index (GI)</h3>
            {giIndex !== undefined ? (
              <>
                <p className="text-4xl font-bold text-accent mb-2">{giIndex}</p>
                {giExplanation && <p className="text-sm text-muted-foreground">{giExplanation}</p>}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">GI information not available or could not be calculated.</p>
            )}
          </div>
        </div>
      </CardContent>
      {/* Optional Footer for actions or additional summary */}
      {/* <CardFooter> 
        <p className="text-xs text-muted-foreground">Nutritional values are estimates and can vary.</p>
      </CardFooter> */}
    </Card>
  );
};

export default NutritionCard;
