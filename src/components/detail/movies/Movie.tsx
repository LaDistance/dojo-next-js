import type { Movie } from "../../../server/api/routers/movies";
import MovieCardDetail from "../../cards/MovieCardDetail";

const MovieDetail = ({ movie }: { movie: Movie }) => {
  return <MovieCardDetail movie={movie} />;
};

export default MovieDetail;
