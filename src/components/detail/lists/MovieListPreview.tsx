import Link from "next/link";
import type { List } from "../../../server/api/routers/lists";
import type { Movie } from "../../../server/api/routers/movies";
import MovieCard from "../../cards/MovieCard";

export default function MovieListPreview({ list }: { list: List }) {
  return (
    <div>
      <h2>{list.name.toUpperCase()}</h2>
      {list.movies.slice(0, 5).map((movie: Movie) => (
        <Link
          href={`/movies/${movie.id}`}
          key={movie.title + movie.release_date}
        >
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
        </Link>
      ))}
    </div>
  );
}
