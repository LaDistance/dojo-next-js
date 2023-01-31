import { Rate } from "antd";
import Image from "next/image";
import { useState } from "react";
import { BiListPlus } from "react-icons/bi";
import { imageUrl } from "../../constants";
import type { Movie } from "../../server/api/routers/movies";
import { AddToListModal } from "../modals/AddToListModal";
import styles from "./MovieCardDetail.module.css";

export default function MovieCardDetail({ movie }: { movie: Movie }) {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <div className={styles.movieDetail}>
      <h1 className={styles.title}>{movie.title}</h1>
      <section className={styles.MovieCardList}>
        <div className={styles.cardImageWrapper}>
          <Image
            className={styles.cardImage}
            src={`${imageUrl}/${movie.poster_path}`}
            alt={movie.title}
            width="250"
            height="375"
          ></Image>
          <div
            className={styles.addToListBtn}
            onClick={(event) => {
              setModalVisible(true);
              event.stopPropagation();
            }}
          >
            <BiListPlus />
          </div>
        </div>
      </section>
      <section className={styles.movieInfo}>
        <p>
          <strong>Release date:</strong> {movie.release_date.toString()}
        </p>
        <section>
          {movie?.genres?.map((genre) => (
            <span key={genre.name} className={styles.label}>
              {genre.name}
            </span>
          ))}
        </section>
        <div className={styles.margin}>
          <Rate allowHalf disabled defaultValue={movie.vote_average / 2} />(
          {(movie.vote_average / 2).toFixed(2)})
          <small className={styles.margin}>{movie.vote_count} votes</small>
        </div>
        <section className={styles.description}>{movie.overview}</section>
      </section>
      <AddToListModal
        movie={movie}
        visible={isModalVisible}
        setVisible={setModalVisible}
      />
    </div>
  );
}
