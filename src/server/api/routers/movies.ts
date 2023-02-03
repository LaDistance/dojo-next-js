import { z } from "zod";

import { env } from "../../../env/server.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const movieSchema = z.object({
  id: z.number(),
  poster_path: z.string(),
  adult: z.boolean(),
  overview: z.string(),
  release_date: z.union([z.string(), z.date()]),
  genres: z.array(z.object({ id: z.number(), name: z.string() })).nullish(),
  original_title: z.string(),
  original_language: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_count: z.number(),
  vote_average: z.number(),
  popularity: z.number(),
});

export type Movie = z.infer<typeof movieSchema>;

export const listResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_results: z.number(),
  total_pages: z.number(),
});

export const moviesRouter = createTRPCRouter({
  getPopular: protectedProcedure.query(async () => {
    const headers = { Authorization: `Bearer ${env.TMDB_BEARER_TOKEN}` };

    const response = await fetch(`${env.TMDB_API_BASE_URL}/movie/popular`, {
      headers: headers,
    });

    const parsedData = listResponseSchema.parse(await response.json());

    return parsedData.results;
  }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const headers = {
        Authorization: `Bearer ${env.TMDB_BEARER_TOKEN}`,
      };

      const response = await fetch(
        `${env.TMDB_API_BASE_URL}/movie/${input.id}`,
        {
          headers: headers,
        }
      );

      const parsedData = movieSchema.parse(await response.json());

      return parsedData;
    }),

  rateMovie: protectedProcedure
    .input(
      z.object({
        movie: movieSchema,
        rating: z.number(),
        comment: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Upsert rating for the current user and the movie with id 'id'
      console.log(input.movie.id, input.rating, input.comment)
      const rating = await ctx.prisma.ratings.upsert({
        where: {
          userId_movieId: {
            userId: ctx.session.user.id,
            movieId: input.movie.id,
          },
        },
        update: {
          rating: input.rating,
          comment: input.comment,
        },
        create: {
          rating: input.rating,
          comment: input.comment,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          Movie: {
            connectOrCreate: {
              where: {
                id: input.movie.id,
              },
              create: {
                ...input.movie,
                release_date: new Date(input.movie.release_date),
                genres: {
                  createMany: {
                    data: input.movie?.genres || [],
                  },
                },
              },
            }
          }
        },
        include: {
          Movie: {
            include: {
              genres: true,
            },
          },
        },
      });

      return rating;
    }),

    getMovieRating: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Get rating for the current user and the movie with id 'id'

      const rating = await ctx.prisma.ratings.findUnique({
        where: {
          userId_movieId: {
            userId: ctx.session.user.id,
            movieId: input.id,
          },
        },
      });

      return rating;
    }),

});
