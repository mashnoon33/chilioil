"use client";

import Link from "next/link";
import { type RouterOutputs } from "@/trpc/react";

type RecipeRes = RouterOutputs["recipe"]["getAll"][number];

const BaseCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col prose w-full aspect-w-1 aspect-h-1 min-h-full rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3 shadow-sm p-4 bg-neutral-50 border-gray-200 dark:border-neutral-300/10 dark:bg-primary border border-blood/10 ${className}`}>
    {children}
  </div>
);

export const RecipeCard = ({ recipe, currentRoute }: { recipe: RecipeRes; currentRoute: string }) => (
  <Link href={`${currentRoute}/${recipe.id}`}>
    <BaseCard>
      <div className="pb-2">
        <h3 className="text-neutral-800/80 dark:text-white/90 font-black pt-0 my-0 line-clamp-1 pb-1">
          {recipe.metadata?.name || "Untitled Recipe"}
        </h3>
        <p className="line-clamp-2 text-sm font-semibold text-neutral-700/80 dark:text-white/50">
          {recipe.metadata?.summary || "No description available"}
        </p>
      </div>
      <div>
        {recipe.ingredients.map((ingredient) => (
          <div 
            key={ingredient.ingredient.id} 
            className="form-check justify-center border-neutral-300/30 dark:border-neutral-600 border-b my-[.5]"
          >
            <div className="flex text-sm text-neutral-900/50 dark:text-white/60 flex-row">
              <label className="form-check-label py-1 mr-3 font-bold inline-block">
                {ingredient.ingredient?.name}
              </label>
              <label className="form-check-label py-1 inline-block text-slate text-neutral-900/40 dark:text-white/60">
                {ingredient.description}
              </label>
              <div className="flex grow justify-end pr-6">
                <label className="form-check-label py-1 inline-block text-slate text-neutral-900/40 dark:text-white/60">
                  {ingredient.quantity} {ingredient.unit}
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full h-3 grow flex"></div>
    </BaseCard>
  </Link>
); 