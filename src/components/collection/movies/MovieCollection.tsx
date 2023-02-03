import Link from "next/link";
import type { Movie } from "../../../server/api/routers/movies";
import MovieCardList from "../../cards/MovieCardList";
import styles from "./MovieCollection.module.css";

const MovieCollection = ({ movies }: { movies: Movie[] }) => {
  return (
    <div className={styles.cardRow}>
      {movies.map((movie) => (
        <Link href={`/movies/${movie.id}`} key={`${movie.id}_${movie.title}`}>
          <MovieCardList movie={movie} />
        </Link>
      ))}
    </div>
  );
};

export default MovieCollection;
