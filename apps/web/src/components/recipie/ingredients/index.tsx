import React from 'react';
import type { Ingredient } from '@repo/parser';
import { RenderIngredientQuantity } from './shared/render-ingedient-quanity';

interface IngredientsProps {
  ingredients: Ingredient[];
}

export const Ingredients: React.FC<IngredientsProps> = ({ ingredients }) => {
  return (
    <div className="py-1">
      {ingredients.map((ingredient, index) => (
        <div
          className="flex flex-row border-b last:border-none border-gray-300 dark:border-neutral-300/10 justify-between px-4 py-2 min-w-1/2"
          key={`${ingredient.name}-${index}`}
        >
          <div className="font-medium flex">
            <div className="text-black dark:text-white font-medium">
              {ingredient.name}
            </div>
            {ingredient.description && (
              <div className="ml-2 text-black/50 dark:text-white/70">
                {ingredient.description}
              </div>
            )}
          </div>
          <RenderIngredientQuantity ingredient={ingredient} />
        </div>
      ))}
    </div>
  );
}; 