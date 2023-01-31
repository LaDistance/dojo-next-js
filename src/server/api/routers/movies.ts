import { z } from "zod";

import { env } from "../../../env/server.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const movieSchema = z.object({
  id: z.number(),
  poster_path: z.string(),
  adult: z.boolean(),
  overview: z.string(),
  release_date: z.union([z.string(), z.date()]),
  genres: z.array(z.object({ id: z.number(), name: z.string() })),
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
});
