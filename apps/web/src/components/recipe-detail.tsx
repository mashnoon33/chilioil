"use client";

import { RecipeComponent } from "@/components/recipie";
import { Button } from "@/components/ui/button";
import { RouterOutputs } from "@/trpc/react";
import { parseRecipe } from "@repo/parser";
import Link from "next/link";
import { useState } from "react";
import { FloatingActionButton } from "./ui/floating-action-button";
import { Slider } from "./ui/slider";
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
  const [scale, setScale] = useState(1);
  if (error || !recipe) return <ErrorView />;
  const parsedRecipe = parseRecipe(recipe.markdown);
  return (
    <div className="h-full w-full">
      <RecipeComponent recipe={parsedRecipe} version={recipe.version} />
      <FloatingActionButton className="pb-5">
        <div className="text-sm text-neutral-400 mb-5">Scale Recipe {scale}</div>

        <Slider value={[scale]} defaultValue={[1]} max={10} min={1} step={1} onValueChange={(value) => setScale(value[0])} />
      </FloatingActionButton>
    </div>
  );
} 