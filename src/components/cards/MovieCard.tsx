import Image from "next/image";
import { IMovie } from "../../types/movie";
import styles from "./MovieCard.module.css";

import { BiListPlus } from "react-icons/bi";

export default function MovieCard(props: { movie: IMovie }) {
  const { movie } = props;

  const imageUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <>
      {movie && (
        <div className={styles.card}>
          <div className={styles.cardImageWrapper}>
            <Image
              className={styles.cardImage}
              src={`${imageUrl}${movie.poster_path}`}
              alt={movie.title}
              width="250"
              height="375"
            ></Image>
            <a href="add-to-list">
              <div className={styles.addToListBtn}>
                <BiListPlus />
              </div>
            </a>
          </div>
          <p className={styles.cardInfo}>{movie.release_date}</p>
          <p className={styles.cardTitle}>{movie.title}</p>
        </div>
      )}
    </>
  );
}
