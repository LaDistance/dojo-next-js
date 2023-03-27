import { type NextPage } from "next";
import MovieCollection from "../components/collection/movies/MovieCollection";
import { api } from "../utils/api";
import styles from "./index.module.css";

const Home: NextPage = () => {
  const { data, isLoading, isError, error } = api.movies.getPopular.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <h1 className={styles.title}>Popular movies</h1>
      <MovieCollection movies={data} />
    </>
  );
};

export default Home;
