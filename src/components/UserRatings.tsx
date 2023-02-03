import type { Movie } from "../server/api/routers/movies";
import styles from "./RateAndComment.module.css";

const RateAndComment = ({ movie }: { movie: Movie }) => {
  return <div className={styles.userRating}>{movie.rating}</div>;
};

export default RateAndComment;
