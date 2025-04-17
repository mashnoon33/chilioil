import { RecipeCard } from "@/components/recipe-card";
import { Button } from "@/components/ui/button";
import { api, staticApi } from "@/trpc/server";
import Link from "next/link";
import { MdPlusOne } from "react-icons/md";

export async function generateStaticParams() {
  const books = await staticApi.book.getAllPublic();
  return books.map(book => ({
    book: book.id
  }));
}


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
  const book = await api.book.getById({ id: resolvedParams.book });
  const currentRoute = `/${resolvedParams.book}`;

  return (
    <div className="mx-auto px-4 my-20 md:px-8">
      <div className="max-w-2xl sm:px-2 lg:max-w-7xl lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col mb-10">
        <h1 className="text-4xl font-bold text-neutral-600 dark:text-white/90">{book?.name}</h1>
        {/* <div className="prose line-clamp-3 max-w-4xl dark:prose-invert prose-neutral-500 dark:text-white/90"><ReactMarkdown>{book?.markdown}</ReactMarkdown></div> */}
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