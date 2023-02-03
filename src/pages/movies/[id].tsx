import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MovieDetail from "../../components/detail/movies/Movie";
import { api } from "../../utils/api";
import styles from "./[id].module.css";

const MovieDetailPage: NextPage = () => {
  const router = useRouter();
  const [movieId, setMovieId] = useState<string>("");

  useEffect(() => {
    if (!router.isReady) return;
    const query = router.query;
    if (!query.id) return;
    if (typeof query.id !== "string") {
      setMovieId(query.id[0] as string);
    } else {
      setMovieId(query.id);
    }
  }, [router.asPath, router.isReady, router.query]);

  const movie = api.movies.getById.useQuery(
    { id: movieId },
    { enabled: !!movieId }
  );

  if (movie.isLoading) return <div>Loading...</div>;

  if (movie.isError) return <div>Error: {movie.error.message}</div>;

  return (
    <div className={styles.main}>
      <MovieDetail movie={movie.data} />
    </div>
  );
};

export default MovieDetailPage;
