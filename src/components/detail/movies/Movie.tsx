import MovieCard from "../../cards/MovieCard";
import { Movie } from "../../../server/api/routers/movies";

export default function MovieDetail({movie} : {movie: Movie}) {
  return (
    <div>
      <MovieCard movie={movie} />
    </div>
  );
}
