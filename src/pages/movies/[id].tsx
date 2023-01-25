import { GetServerSideProps } from "next";
import MovieDetail from "../../components/detail/movies/Movie";
import { api } from "../../utils/api";
import styles from "./[id].module.css";

const MovieDetailPage = ({ id }: { id: string }) => {
  const movie = api.movies.getById.useQuery({ id: id });

  if (movie.isLoading) return <div>Loading...</div>;

  if (movie.isError) return <div>Error: {movie.error.message}</div>;

  return (
    <div className={styles.main}>
      <MovieDetail movie={movie.data} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context?.params?.id;

  return {
    props: { id },
  };
};

export default MovieDetailPage;
