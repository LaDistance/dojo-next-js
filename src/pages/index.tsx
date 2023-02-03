import { type NextPage } from "next";
import MovieCollection from "../components/collection/movies/MovieCollection";
import { api } from "../utils/api";
import styles from "./index.module.css";

const Home: NextPage = () => {
  const movies = api.movies.getPopular.useQuery();

  if (movies.isLoading) return <div>Loading...</div>;

  if (movies.isError) return <div>Error: {movies.error.message}</div>;

  return (
    <>
      <h1 className={styles.title}>Popular movies</h1>
      <MovieCollection movies={movies.data} />
    </>
  );
};

export default Home;
