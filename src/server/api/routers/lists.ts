import { z } from "zod";
import { NamedObject } from "../../../types/general";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { movieSchema } from "./movies";

export const ListSchema = NamedObject.extend({
  userId: z.string(),
  movies: z.array(movieSchema),
});

export type List = z.infer<typeof ListSchema>;

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

  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const list = await ctx.prisma.list.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          movies: true,
        },
      });

      return list;
    }),

  createListWithMovie: protectedProcedure
    .input(
      z.object({
        listName: z.string(),
        movie: movieSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Endpoint used when the list does not exist yet
      const list = await ctx.prisma.list.create({
        data: {
          name: input.listName,
          userId: ctx.session.user.id,
          movies: {
            connectOrCreate: {
              where: {
                id: input.movie.id,
              },
              create: {
                ...input.movie,
                genres: {
                  createMany: {
                    data: input.movie.genres,
                  },
                },
              },
            },
          },
        },
        include: {
          movies: {
            include: {
              genres: true,
            },
          },
        },
      });

      return { list: list };
    }),

  addMovieToList: protectedProcedure
    .input(
      z.object({
        listId: z.number(),
        movie: movieSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Endpoint used when the list does not exist yet
      const list = await ctx.prisma.list.update({
        where: { id: input.listId },
        data: {
          movies: {
            connectOrCreate: {
              where: {
                id: input.movie.id,
              },
              create: {
                ...input.movie,
                genres: {
                  createMany: {
                    data: input.movie.genres,
                  },
                },
              },
            },
          },
        },
        include: {
          movies: {
            include: {
              genres: true,
            },
          },
        },
      });

      return { list: list };
    }),
});
