import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const scraperRouter = createTRPCRouter({
  scrapeRecipe: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      const response = await fetch("https://chillioil-flask.vercel.app/scrape-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Failed to scrape recipe");
      }

      return response.json();
    }),
}); 