import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MovieDetail from "../../components/detail/movies/Movie";
import { api } from "../../utils/api";
import styles from "./[id].module.css";

const MovieDetailPage = () => {
  const router = useRouter();
  const [movieId, setMovieId] = useState<string>("");

  useEffect(() => {
    if (!router.isReady) return;
    const query = router.query;
    setMovieId(query?.id);
  }, [router.isReady, router.query]);

  const movie = api.movies.getById.useQuery({ id: movieId });

  if (movie.isLoading) return <div>Loading...</div>;

  if (movie.isError) return <div>Error: {movie.error.message}</div>;

  return (
    <div className={styles.main}>
      <MovieDetail movie={movie.data} />
    </div>
  );
};

export default MovieDetailPage;
