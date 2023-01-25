import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { env } from "../../../env/server.mjs";


export const movieSchema = z.object({
  poster_path: z.string(),
  adult: z.boolean(),
  overview: z.string(),
  release_date: z.string(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  original_title: z.string(),
  original_language: z.string(),
  title: z.string(),
  backdrop_path: z.string(),
  popularity: z.number(),
  vote_count: z.number(),
  video: z.boolean(),
  vote_average: z.number()
})

export type Movie = z.infer<typeof movieSchema>;
export const responseSchema = z.object({
  page: z.number(),
  results: z.array(
    movieSchema
  ),
  total_results: z.number(),
  total_pages: z.number()
})

export const moviesRouter = createTRPCRouter({
  getPopular: publicProcedure.query(async () => {
    const headers = { Authorization: `Bearer ${env.TMDB_BEARER_TOKEN}` };

    const response = await fetch(
      `${env.TMDB_API_BASE_URL}/movie/popular`, { 
        headers: headers
      }
    );

    const parsedData = responseSchema.parse(await response.json());

    return parsedData.results;
  }),
});
