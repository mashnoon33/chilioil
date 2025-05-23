import { adminRouter } from "./routers/admin";
import { bookRouter } from "./routers/books";
import { recipeRouter } from "./routers/recipes";
import { scraperRouter } from "./routers/scraper";
import { createTRPCRouter, createCallerFactory } from "./trpc";
import { forkRouter } from "./routers/fork";
import { searchRouter } from "./routers/search";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  recipe: recipeRouter,
  fork: forkRouter,
  book: bookRouter,
  admin: adminRouter,
  scraper: scraperRouter,
  search: searchRouter,
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
