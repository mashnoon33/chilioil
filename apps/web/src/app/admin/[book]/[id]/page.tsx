"use client";

import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { RecipeDetail } from "@/components/recipe-detail";
import { parseRecipe } from "@repo/parser";
import { RecipeComponent } from "@/components/recipie";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { parseFrontmatter } from "@/components/editor/monaco/faux-language-server/frontmatter";
import { format } from "date-fns";
import { FakeChart } from "@/components/fake/chart";
export default function AdminRecipeDetailPage() {
  const params = useParams();
  const { data: recipe } = api.recipe.getById.useQuery({
    id: params.id as string,
    bookId: params.book as string
  });

  if (!recipe) {
    return null;
  }

  const parsedRecipe = parseRecipe(recipe.markdown);
  const parsedFrontmatter = parseFrontmatter(recipe.markdown);
  return (
    <div className="h-full w-full pb-[400px]">
      <RecipeComponent recipe={parsedRecipe} version={recipe.version} />
      <FloatingActionButton className=" text-neutral-300">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-1 items-center text-sm">
            <div className={`h-2 w-2 rounded-full ${recipe.draft ? "bg-yellow-500" : "bg-green-500"}`} />
            <span className={`font-medium ${recipe.draft ? "text-yellow-500" : "text-green-500"}`}> {recipe.draft ? "Draft" : "Published"}</span>
          </div>
          <div className="text-xs text-neutral-400">
            version {recipe.version}
          </div>
        </div>
        {!recipe.draft && <FakeChart />}
        <div className="flex mt-2 flex-col gap-2  text-sm">
          <KeyValuePair label="Slug" value={recipe.slug} />
          <TwoItems>
            <KeyValuePair label="Created" value={format(recipe.createdAt, "MMM d, yyyy")} />
            <KeyValuePair label="Updated" value={format(recipe.updatedAt, "MMM d, yyyy")} />

          </TwoItems>
        </div>
      </FloatingActionButton>
    </div>
  );
}

function KeyValuePair({ label, value }: { label: string, value: string | null | undefined }) {

  return (
    <div className="flex flex-col  ">
      <span className="text-xs text-neutral-400">{label}</span>
      <span className="text-neutral-300">{value ?? "Undefined"}</span>
    </div>
  );
}

function TwoItems({children}: {children: React.ReactNode}) {
  return (
    <div className="grid grid-cols-2 gap-1 text-sm">
      {children}
    </div>
  );
}
