import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { movieSchema } from "./movies";

export const RatingSchema = z.object({
  userId: z.string(),
  movie: movieSchema,
  rating: z.number(),
  comment: z.string(),
});

export type List = z.infer<typeof RatingSchema>;

export const listsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const lists = await ctx.prisma.list.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        movies: true,
      },
    });

    return lists;
  }),

  getRatingForMovie: protectedProcedure
    .input(
      z.object({
        movieId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const list = await ctx.prisma.ratings.findUniqueOrThrow({
        where: {
          movieId: input.movieId,
        },
      });

      return list;
    }),
});
