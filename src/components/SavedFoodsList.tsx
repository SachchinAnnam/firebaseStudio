"use client";

import type { FC } from 'react';
import type { FoodItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Trash2, Bookmark } from 'lucide-react';

interface SavedFoodsListProps {
  savedFoods: FoodItem[];
  onSelectFood: (foodItem: FoodItem) => void;
  onRemoveFood: (foodItemId: string) => void;
}

const SavedFoodsList: FC<SavedFoodsListProps> = ({ savedFoods, onSelectFood, onRemoveFood }) => {
  if (savedFoods.length === 0) {
    return (
      <Card className="shadow">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground flex items-center">
            <Bookmark size={20} className="mr-2 text-primary" />
            Saved Foods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">You haven't saved any food items yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground flex items-center">
          <Bookmark size={20} className="mr-2 text-primary" />
          Saved Foods
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-3"> {/* Adjust height as needed */}
          <ul className="space-y-2">
            {savedFoods.map((food) => (
              <li key={food.id} className="flex items-center justify-between p-2 bg-background rounded-md border">
                <span className="text-sm font-medium text-foreground truncate mr-2" title={food.name}>{food.name}</span>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => onSelectFood(food)} aria-label={`View ${food.name}`}>
                    <Eye size={16} className="text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onRemoveFood(food.id)} aria-label={`Remove ${food.name}`}>
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SavedFoodsList;
