import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { movieSchema } from "./movies";

export const ListSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  movies: z.array(movieSchema),
});

export type List = z.infer<typeof ListSchema>;

export const listsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

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

  createListWithMovie: protectedProcedure
    .input(
      z.object({
        listName: z.string(),
        movie: z.object({
          id: z.string(),
          title: z.string(),
          release_date: z.date(),
          overview: z.string(),
          image_path: z.string(),
        }),
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
                id: input.movie.id,
                title: input.movie.title,
                release_date: input.movie.release_date,
                overview: input.movie.overview,
                image_path: input.movie.image_path,
              },
            },
          },
        },
        include: {
          movies: true,
        },
      });

      return { list: list };
    }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
