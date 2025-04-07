"use client";

import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { RecipeDetail } from "@/components/recipe-detail";

export default function AdminRecipeDetailPage() {
  const params = useParams();
  const { data: recipe } = api.recipe.getById.useQuery({ 
    id: params.id as string,
    bookId: params.book as string
  });

  if (!recipe) {
    return null;
  }

  return <RecipeDetail recipe={recipe} book={params.book as string} />;
}