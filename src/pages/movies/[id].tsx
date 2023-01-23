import { GetServerSideProps } from "next";
import MovieDetail from "../../components/detail/movies/Movie";
import { IMovie } from "../../types/movie";
import styles from "./[id].module.css";

export default function (props: { movie: IMovie }) {
  const { movie } = props;

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
