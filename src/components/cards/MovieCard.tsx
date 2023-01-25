import Image from "next/image";
import Link from "next/link";
import { BiListPlus } from "react-icons/bi";
import { Movie } from "../../server/api/routers/movies";
import styles from "./MovieCard.module.css";

export default function MovieCard({ movie }: { movie: Movie }) {
  const imageUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <>
      {movie && (
        <div className={styles.card}>
          <div className={styles.cardImageWrapper}>
            <Image
              className={styles.cardImage}
              src={`${imageUrl}/${movie.poster_path}`}
              alt={movie.title}
              width="250"
              height="375"
            ></Image>
            <Link href="add-to-list">
              <div className={styles.addToListBtn}>
                <BiListPlus />
              </div>
            </Link>
          </div>
          <p className={styles.cardInfo}>{movie.release_date}</p>
          <p className={styles.cardTitle}>{movie.title}</p>
        </div>
      )}
    </>
  );
}
