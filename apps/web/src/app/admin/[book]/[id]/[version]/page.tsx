"use client";

import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { RecipeDetail } from "@/components/recipe-detail";
import { Loader2 } from "lucide-react";

export default function AdminRecipeDetailPage() {
  const params = useParams();
  const version = parseInt(params.version as string);
  const { data: recipe, isLoading } = api.recipe.getByIdWithVersion.useQuery({
    id: params.id as string,
    version: version
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return  <RecipeDetail recipe={recipe} book={params.book as string} />;

}