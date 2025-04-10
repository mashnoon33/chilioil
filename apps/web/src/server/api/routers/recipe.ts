import { z } from "zod";

import { parseFrontmatter } from "@/components/editor/monaco/faux-language-server/frontmatter";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "@/server/api/trpc";
import { parseRecipe, Recipe } from "@repo/parser";
import type { PrismaClient } from "@prisma/client";

type Context = {
  db: PrismaClient;
  session: {
    user: {
      id: string;
    };
  };
};

// Utility function to handle ingredient creation and linking
async function handleRecipeIngredients(
  ctx: Context,
  recipeId: string,
  parsedRecipe: Recipe,
  metadataId: string | undefined
) {
  // Extract ingredients from parsed recipe
  const ingredients = parsedRecipe.sections.flatMap((section) => section.ingredients);

  // Create or link ingredients
  for (const ing of ingredients) {
    // Find or create the base ingredient
    const ingredient = await ctx.db.ingredient.upsert({
      where: { name: ing.name },
      create: { name: ing.name },
      update: { name: ing.name },
    });

    // Link ingredient to recipe with quantity/unit info
    await ctx.db.recipeIngredient.upsert({
      where: {
        recipeId_ingredientId: {
          recipeId: recipeId,
          ingredientId: ingredient.id,
        },
      },
      create: {
        recipeId: recipeId,
        ingredientId: ingredient.id,
        quantity: ing.quantity || null,
        unit: ing.unit || null,
        description: ing.description || null,
        metadataId: metadataId,
        important: ing.important || false,
      },
      update: {
        quantity: ing.quantity || null,
        unit: ing.unit || null,
        description: ing.description || null,
        metadataId: metadataId,
      },
    });
  }
}

// Utility function to delete all ingredients for a recipe
async function deleteRecipeIngredients(ctx: Context, recipeId: string) {
  await ctx.db.recipeIngredient.deleteMany({
    where: { recipeId: recipeId },
  });
}
// Common recipe select pattern
const recipeSelect = {
  id: true,
  markdown: true,
  version: true,
  public: true,
  bookId: true,
  ingredients: {
    where: {
      important: true
    },
    select: {
      ingredient: {
        select: {
          id: true,
          name: true
        }
      },
      quantity: true,
      unit: true,
      description: true
    }
  },
  metadata: true,
};

// Common recipe query function
async function getRecipes(ctx: Context, bookId: string, publicOnly: boolean = false) {
  return await ctx.db.recipe.findMany({
    where: { 
      bookId,
      ...(publicOnly ? { public: true } : {})
    },
    select: {
      id: true,
      markdown: true,
      version: true,
      public: true,
      bookId: true,
      ingredients: {
        where: {
          important: true
        },
        select: {
          ingredient: {
            select: {
              id: true,
              name: true
            }
          },
          quantity: true,
          unit: true,
          description: true
        }
      },
      metadata: true
    }
  });
}

// Common recipe by id query function
async function getRecipeById(ctx: Context, id: string, bookId: string, publicOnly: boolean = false) {
  return await ctx.db.recipe.findUnique({
    where: { 
      id,
      bookId,
      ...(publicOnly ? { public: true } : {})
    },
    select: recipeSelect,
  });
}

export const recipeRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      return getRecipes(ctx, input.bookId);
    }),

  getAllPublic: publicProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      return getRecipes(ctx, input.bookId, true);
    }),

  getByIdPublic: publicProcedure
    .input(z.object({ id: z.string(), bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      return getRecipeById(ctx, input.id, input.bookId, true);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string(), bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      return getRecipeById(ctx, input.id, input.bookId);
    }),

  listVersions: protectedProcedure
    .input(z.object({ id: z.string(), bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.recipeHistory.findMany({
        where: { recipeId: input.id },
      });
    }),

  getByIdWithVersion: protectedProcedure
    .input(z.object({ id: z.string(), version: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.recipeHistory.findUnique({
        where: { recipeId_version: { recipeId: input.id, version: input.version } },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        markdown: z.string(),
        bookId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Parse the markdown to extract metadata
      const parsedRecipe = parseRecipe(input.markdown);
      const frontmatter = parseFrontmatter(input.markdown);
      // Create the recipe
      const recipe = await ctx.db.recipe.create({
        data: {
          markdown: input.markdown,
          bookId: input.bookId,
          metadata: {
            create: {
              name: parsedRecipe.title || "Untitled Recipe",
              summary: parsedRecipe.description || "",
              cuisine: frontmatter.parsed.cuisine || [],
            },
          },
          history: {
            create: {
              markdown: input.markdown,
              version: 1,
            },
          },
        },
        select: {
          ...recipeSelect,
          history: true,
        },
      });

      try {
        await handleRecipeIngredients(ctx, recipe.id, parsedRecipe, recipe.metadata?.id);
      } catch (error) {
        console.error("Error adding ingredients:", error);
      }
    
      return recipe;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        bookId: z.string(),
        markdown: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const recipe = await ctx.db.recipe.findUnique({
        where: {
          id: input.id,
          bookId: input.bookId,
        },
        select: {
          book: {
            select: {
              userId: true
            }
          },
          history: {
            orderBy: {
              version: 'desc'
            },
            take: 1,
            select: {
              version: true
            }
          }
        },
      });

      if (!recipe) {
        throw new Error("Recipe not found");
      }

      if (recipe.book.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      // Parse the markdown to extract metadata
      const parsedRecipe = parseRecipe(input.markdown);
      const latestVersion = recipe.history[0]?.version ?? 0;

      // Delete existing ingredients
      await deleteRecipeIngredients(ctx, input.id);

      // Update the recipe
      const updatedRecipe = await ctx.db.recipe.update({
        where: {
          id: input.id,
          bookId: input.bookId,
        },
        data: {
          markdown: input.markdown,
          version: latestVersion + 1,
          metadata: {
            update: {
              name: parsedRecipe.title || "Untitled Recipe",
              summary: parsedRecipe.description || "",
            },
          },
          history: {
            create: {
              markdown: input.markdown,
              version: latestVersion + 1,
            },
          },
        },
        select: {
          ...recipeSelect,
          history: true,
        },
      });

      try {
        await handleRecipeIngredients(ctx, input.id, parsedRecipe, updatedRecipe.metadata?.id);
      } catch (error) {
        console.error("Error updating ingredients:", error);
      }

      return updatedRecipe;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string(), bookId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.recipe.delete({
        where: { id: input.id, bookId: input.bookId },
      });
    }),
});
