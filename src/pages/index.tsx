import { type NextPage } from "next";
import Link from "next/link";
import MovieCardList from "../components/cards/MovieCardList";
import { api } from "../utils/api";
import styles from "./index.module.css";

const Home: NextPage = () => {
  const movies = api.movies.getPopular.useQuery();

  if (movies.isLoading) return <div>Loading...</div>;

  if (movies.isError) return <div>Error: {movies.error.message}</div>;

  return (
    <>
      <h1 className={styles.title}>Popular movies</h1>
      <div className={styles.cardRow}>
        {movies.data.map((movie) => (
          <Link href={`/movies/${movie.id}`} key={`${movie.id}_${movie.title}`}>
            <MovieCardList movie={movie} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
