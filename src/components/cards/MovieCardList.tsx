import Image from "next/image";
import { imageUrl } from "../../constants";
import type { Movie } from "../../server/api/routers/movies";
import styles from "./MovieCardList.module.css";

export default function MovieCardList({ movie }: { movie: Movie }) {
  return (
    <>
      {movie ? (
        <div className={styles.card}>
          <div className={styles.cardImageWrapper}>
            <Image
              className={styles.cardImage}
              src={`${imageUrl}/${movie.poster_path}`}
              alt={movie.title}
              width="250"
              height="375"
            ></Image>
          </div>
          <p className={styles.cardInfo}>{movie.release_date.toString()}</p>
          <p className={styles.cardTitle}>{movie.title}</p>
        </div>
      ) : null}
    </>
  );
}
