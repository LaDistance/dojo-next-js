import { type NextPage } from "next";
import Link from "next/link";
import styles from "./index.module.css";
import MovieCard from "../components/cards/MovieCard";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const movies = api.movies.getPopular.useQuery();
  
  if (movies.isLoading) return <div>Loading...</div>;

  if (movies.isError) return <div>Error: {movies.error.message}</div>;
  return (
    <>
      <div className={styles.cardRow}>
        {movies.data.map((movie) => (
          <Link
            href={`/movies/${movie.id}`}
            key={movie.title + movie.release_date}
          >
            <MovieCard movie={movie} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
