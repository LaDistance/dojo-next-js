import { createTRPCRouter } from "./trpc";
import { listsRouter } from "./routers/lists";
import { moviesRouter } from "./routers/movies";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  lists: listsRouter,
  movies: moviesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
