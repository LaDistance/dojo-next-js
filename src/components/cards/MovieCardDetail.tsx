import { Button, Input, Rate } from "antd";
import Image from "next/image";
import { useState } from "react";
import type { ChangeEventHandler } from "react";
import { BiListPlus } from "react-icons/bi";
import { imageUrl } from "../../constants";
import type { Movie } from "../../server/api/routers/movies";
import { AddToListModal } from "../modals/AddToListModal";
import styles from "./MovieCardDetail.module.css";
import { api } from "../../utils/api";

export default function MovieCardDetail({ movie }: { movie: Movie }) {
  const [isModalVisible, setModalVisible] = useState(false);

  const rating = api.movies.getMovieRating.useQuery({ id: movie.id });

  const rateMovie = api.movies.rateMovie.useMutation({
    onSuccess: async (data) => {
      console.log(data);
      await rating.refetch();
    },
  });

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setComment(event.target.value);
  };
  const onRateChange = (value: number) => {
    setRate(value);
  };
  const onClick = () => {
    rateMovie.mutate({ movie: movie, rating: rate, comment: comment });
  };

  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");

  if (rating.isLoading) {
    return <div>Loading...</div>;
  }

  if (rating.isError) {
    return <div>Error: {rating.error.message}</div>;
  }

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
        <section className={styles.margin}>
          {" "}
          <Rate
            onChange={onRateChange}
            defaultValue={rating.data?.rating ?? 5}
          />
        </section>
        <section className={styles.margin}>
          {" "}
          <Input
            placeholder="Add a comment to this movie..."
            onChange={onInputChange}
            defaultValue={rating.data?.comment ? rating.data?.comment : ""}
          />
        </section>
        <section className={styles.margin}>
          {" "}
          <Button type="primary" onClick={onClick}>
            Rate
          </Button>
        </section>
      </section>
      <AddToListModal
        movie={movie}
        visible={isModalVisible}
        setVisible={setModalVisible}
      />
    </div>
  );
}
