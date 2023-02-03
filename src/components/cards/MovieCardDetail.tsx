import { Divider, Rate, Tag } from "antd";
import Image from "next/image";
import type { ChangeEventHandler } from "react";
import { useState } from "react";
import { BiListPlus } from "react-icons/bi";
import { imageUrl } from "../../constants";
import type { Movie } from "../../server/api/routers/movies";
import { api } from "../../utils/api";
import RateAndComment from "../action/RateAndComment";
import { AddToListModal } from "../modals/AddToListModal";
import styles from "./MovieCardDetail.module.css";

const MovieCardDetail = ({ movie }: { movie: Movie }) => {
  // States
  const [isModalVisible, setModalVisible] = useState(false);
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");

  // Queries/Mutations
  const rating = api.movies.getMovieRating.useQuery({ id: movie.id });
  const rateMovie = api.movies.rateMovie.useMutation({
    onSuccess: async () => {
      await rating.refetch();
    },
  });

  // Handlers
  const onCommentChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setComment(event.target.value);
  };
  const onRateChange = (value: number) => {
    setRate(value);
  };

  const onRateCommentSubmit = () => {
    rateMovie.mutate({ movie: movie, rating: rate, comment: comment });
  };

  if (rating.isLoading) {
    return <div>Loading...</div>;
  }

  if (rating.isError) {
    return <div>Error: {rating.error.message}</div>;
  }

  return (
    <div className={styles.movieDetail}>
      <h1 className={styles.title}>{movie.title}</h1>

      <section>
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
            <Tag color="cyan" key={genre.name}>
              {genre.name}
            </Tag>
          ))}
        </section>
        <div className={styles.ratings}>
          <Rate allowHalf disabled defaultValue={movie.vote_average / 2} />(
          {(movie.vote_average / 2).toFixed(2)})
          <small>{movie.vote_count} votes</small>
        </div>
        <section className={styles.description}>{movie.overview}</section>

        <Divider />

        <h2>Rate this movie</h2>
        <RateAndComment
          rating={rating?.data?.rating}
          comment={rating?.data?.comment}
          onRateChange={onRateChange}
          onCommentChange={onCommentChange}
          onRateCommentSubmit={onRateCommentSubmit}
        />
      </section>

      <AddToListModal
        movie={movie}
        visible={isModalVisible}
        setVisible={setModalVisible}
      />
    </div>
  );
};

export default MovieCardDetail;
