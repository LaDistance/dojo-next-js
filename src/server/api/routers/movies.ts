import { z } from "zod";

import { env } from "../../../env/server.mjs";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const movieSchema = z.object({
  poster_path: z.string(),
  adult: z.boolean(),
  overview: z.string(),
  release_date: z.string(),
  genre_ids: z.array(z.number()).nullish(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })).nullish(),
  id: z.number(),
  original_title: z.string(),
  original_language: z.string(),
  title: z.string(),
  backdrop_path: z.string(),
  popularity: z.number(),
  vote_count: z.number(),
  video: z.boolean(),
  vote_average: z.number(),
});

export type Movie = z.infer<typeof movieSchema>;
export const listResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_results: z.number(),
  total_pages: z.number(),
});

export const moviesRouter = createTRPCRouter({
  getPopular: publicProcedure.query(async () => {
    const headers = { Authorization: `Bearer ${env.TMDB_BEARER_TOKEN}` };

    const response = await fetch(`${env.TMDB_API_BASE_URL}/movie/popular`, {
      headers: headers,
    });

    const parsedData = listResponseSchema.parse(await response.json());

    return parsedData.results;
  }),
  getById: publicProcedure
    .input(
      z
        .object({
          id: z.string(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const headers = {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      };
      const response = await fetch(
        `${process.env.TMDB_API_BASE_URL}/movie/${input?.id}`,
        {
          headers: headers,
        }
      );
      const parsedData = movieSchema.parse(await response.json());

      return parsedData;
    }),
});
