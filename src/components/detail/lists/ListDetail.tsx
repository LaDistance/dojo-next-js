import Link from "next/link";
import type { List } from "../../../server/api/routers/lists";
import type { Movie } from "../../../server/api/routers/movies";
import MovieCardList from "../../cards/MovieCardList";
import styles from "./ListDetail.module.css";

export default function ListDetail({ list }: { list: List }) {
  return (
    <>
      <h2>{list.name.toUpperCase()}</h2>
      <div className={styles.cardRow}>
        {list.movies.map((movie: Movie) => (
          <Link href={`/movies/${movie.id}`} key={`${movie.id}_${movie.title}`}>
            <MovieCardList enableButton={false} movie={movie} key={movie.id} />
          </Link>
        ))}
      </div>
    </>
  );
}
