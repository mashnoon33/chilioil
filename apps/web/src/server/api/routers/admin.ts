import { z } from "zod";
import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const adminRouter = createTRPCRouter({
  getDashboardData: protectedProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ input }) => {
      // Get total recipes count
      const totalRecipes = await db.recipe.count({
        where: { bookId: input.bookId },
      });

      // Get recent recipes with their metadata
      const recentRecipes = await db.recipe.findMany({
        where: { bookId: input.bookId },
        include: { metadata: true, ingredients: {
            include: {
                ingredient: true,
            }
        } },
        orderBy: { updatedAt: "desc" },
        take: 6, // Show last 6 recipes
      });

      // Get last updated timestamp
      const lastUpdated = recentRecipes[0]?.updatedAt
        ? new Date(recentRecipes[0].updatedAt).toLocaleDateString()
        : "Never";

      return {
        totalRecipes,
        recentRecipes,
        lastUpdated,
      };
    }),
}); 