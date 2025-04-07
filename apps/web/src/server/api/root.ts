import { recipeRouter } from "@/server/api/routers/recipe";
import { blogRouter } from "@/server/api/routers/blog";
import { adminRouter } from "@/server/api/routers/admin";
import { scraperRouter } from "@/server/api/routers/scraper";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  recipe: recipeRouter,
  blog: blogRouter,
  admin: adminRouter,
  scraper: scraperRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
