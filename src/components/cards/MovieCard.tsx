import Image from "next/image";
import Link from "next/link";
import { BiListPlus } from "react-icons/bi";
import { Movie } from "../../server/api/routers/movies";
import styles from "./MovieCard.module.css";
import { AddToListModal } from "../modals/AddToListModal";
import { useState } from "react";

export default function MovieCard({ movie, enableButton }: { movie: Movie, enableButton: boolean }) {
  const imageUrl = "https://image.tmdb.org/t/p/w500";
  const [isModalVisible, setModalVisible] = useState(false);

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
              {enableButton ? <div className={styles.addToListBtn} onClick={(event) => {setModalVisible(true); event.stopPropagation()}}>
                <BiListPlus />
              </div> : null}
          </div>
          <p className={styles.cardInfo}>{movie.release_date}</p>
          <p className={styles.cardTitle}>{movie.title}</p>
        </div>
      ) : null}
      <AddToListModal movie={movie} visible={isModalVisible} setVisible={setModalVisible} />
    </>
  );
}
