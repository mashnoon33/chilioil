"use client";

import { RecipeComponent } from "@/components/recipie";
import { Button } from "@/components/ui/button";
import { RouterOutputs } from "@/trpc/react";
import { parseRecipe } from "@repo/parser";
import Link from "next/link";


const ErrorView = () => (
  <div className="container mx-auto py-6 text-center">
    <h2 className="text-2xl font-bold mb-4">Recipe Not Found</h2>
    <p className="mb-6 text-gray-600">
      The recipe you're looking for doesn't exist or has been removed.
    </p>
    <Button asChild>
      <Link href="/recipes">Browse Recipes</Link>
    </Button>
  </div>
);

interface RecipeDetailProps {
  recipe: RouterOutputs["recipe"]["getById"] | RouterOutputs["recipe"]["getByIdWithVersion"];
  book: string;
  isLoading?: boolean;
  error?: Error | null;
}

export function RecipeDetail({ recipe, book, isLoading, error }: RecipeDetailProps) {
  if (error || !recipe) return <ErrorView />;
  const parsedRecipe = parseRecipe(recipe.markdown);
  return (
    <div className="container mx-auto py-6">
        <RecipeComponent recipe={parsedRecipe} version={recipe.version} />
    </div>
  );
} 