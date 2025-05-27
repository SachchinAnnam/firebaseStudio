"use client";

import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface FoodSearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const FoodSearchForm: FC<FoodSearchFormProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-card rounded-lg shadow">
      <div>
        <Label htmlFor="food-search" className="text-lg font-medium text-foreground mb-2 block">
          Search Food Item
        </Label>
        <div className="flex space-x-2">
          <Input
            id="food-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Apple, Banana bread"
            className="flex-grow"
            aria-label="Search for food item"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !query.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Search size={18} className="mr-2" />
            )}
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FoodSearchForm;
