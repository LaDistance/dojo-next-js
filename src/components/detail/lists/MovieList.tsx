import type { List } from "../../../server/api/routers/lists";
import type { Movie } from "../../../server/api/routers/movies";
import MovieCard from "../../cards/MovieCard";

export default function MovieListDetail({ list }: { list: List }) {
  return (
    <div>
      <h2>{list.name}</h2>
      {list.movies.map((movie: Movie) => (
        <MovieCard
          enableButton={false}
          movie={{
            id: parseInt(movie.id),
            title: movie.title,
            poster_path: movie.image_path,
            release_date: movie.release_date.toISOString(),
            overview: movie.overview,
          }}
          key={movie.id}
        />
      ))}
    </div>
  );
}
