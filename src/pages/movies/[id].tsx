import { GetServerSideProps } from "next";
import MovieDetail from "../../components/detail/movies/Movie";
import styles from "./[id].module.css";
import { Movie } from "../../server/api/routers/movies";

export default function ({ movie }: { movie: Movie}) {
  return (
    <div className={styles.main}>
      <MovieDetail movie={movie} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = { Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}` };
  const response = await fetch(
    `${process.env.TMDB_API_BASE_URL}/movie/${context?.params?.id}`,
    {
      headers: headers,
    }
  );
  const movie = await response.json();

  return {
    props: { movie },
  };
};
