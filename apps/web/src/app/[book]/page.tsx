import Link from "next/link";
import { api, staticApi } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import { MdPlusOne } from "react-icons/md";

export async function generateStaticParams() {
  const books = await staticApi.book.getAllPublic();
  return books.map(book => ({
    book: book.id
  }));
}

const BaseCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col prose w-full aspect-w-1 aspect-h-1 min-h-full rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3 shadow-sm p-4 bg-neutral-50 border-gray-200 dark:border-neutral-300/10 dark:bg-primary border border-blood/10 ${className}`}>
    {children}
  </div>
);

const RecipeCard = ({ recipe, currentRoute }: { recipe: any; currentRoute: string }) => (
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
        {recipe.ingredients.map((ingredient: any) => (
          <div 
            key={ingredient.id} 
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

const EmptyState = () => (
  <div className="text-center py-16">
    <h2 className="text-xl font-medium mb-4">No recipes found</h2>
    <p className="text-gray-500 mb-8">Get started by creating your first recipe!</p>
    <Button asChild>
      <Link href="/create">
        <MdPlusOne className="h-4 w-4 mr-2" />
        Create Recipe
      </Link>
    </Button>
  </div>
);

const CreateRecipeButton = () => (
  <Button asChild>
    <Link href="/create">
      <MdPlusOne className="h-4 w-4 mr-2" />
      Create Recipe
    </Link>
  </Button>
);

export default async function RecipesPage({
  params,
}: {
  params: Promise<{ book: string }>;
}) {
  const resolvedParams = await params;
  const recipes = await api.recipe.getAllPublic({ bookId: resolvedParams.book });
  const currentRoute = `/${resolvedParams.book}`;

  return (
    <div className="mx-auto px-4 my-20 md:px-8">
      <div className="max-w-2xl sm:px-2 lg:max-w-7xl lg:px-8 py-16 sm:py-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Recipes</h1>
          <CreateRecipeButton />
        </div>

        {recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} currentRoute={currentRoute} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}