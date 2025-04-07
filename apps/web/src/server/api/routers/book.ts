import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const bookRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.book.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
        recipes: true,
      },
    });
  }),

  // Public version for static generation
  getAllPublic: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.book.findMany({
      where: {
        public: true,
      },
      select: {
        id: true,
        name: true,
        recipes: true,
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be a dash-separated string with no spaces'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.book.create({
        data: {
          id: input.slug,
          userId: ctx.session.user.id,
        },
      });
    }),
}); 