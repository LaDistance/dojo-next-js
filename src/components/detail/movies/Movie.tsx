import { Rate } from "antd";
import type { Movie } from "../../../server/api/routers/movies";
import MovieCard from "../../cards/MovieCard";
import styles from "./Movie.module.css";

export default function MovieDetail({ movie }: { movie: Movie }) {
  return (
    <div className={styles.movieDetail}>
      <section className={styles.movieCard}>
        <MovieCard enableButton movie={movie} />
      </section>
      <section className={styles.movieInfo}>
        <section>
          {movie?.genres?.map((genre) => (
            <span key={genre.name} className={styles.label}>
              {genre.name}
            </span>
          ))}
        </section>
        <p>
          <span>
            <Rate allowHalf disabled defaultValue={movie.vote_average / 2} />(
            {movie.vote_average})
          </span>
          <small className={styles.margin}>{movie.vote_count} votes</small>
        </p>
        <section className={styles.description}>{movie.overview}</section>
      </section>
    </div>
  );
}
