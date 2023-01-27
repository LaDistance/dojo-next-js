import type { Movie } from "../../../server/api/routers/movies";
import MovieCardDetail from "../../cards/MovieCardDetail";

export default function MovieDetail({ movie }: { movie: Movie }) {
  return <MovieCardDetail movie={movie} />;
}
