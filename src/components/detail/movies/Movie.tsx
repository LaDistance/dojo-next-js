import { IMovie } from "../../../types/movie";
import MovieCard from "../../cards/MovieCard";

export default function MovieDetail(props: { movie: IMovie }) {
  const { movie } = props;

  return (
    <div>
      <MovieCard movie={movie} />
    </div>
  );
}
