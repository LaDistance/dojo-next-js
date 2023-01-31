import { Button, Divider } from "antd";
import Link from "next/link";
import type { List } from "../../../server/api/routers/lists";
import type { Movie } from "../../../server/api/routers/movies";
import MovieCardList from "../../cards/MovieCardList";
import styles from "./ListDetail.module.css";

export default function ListDetailPreview({ list }: { list: List }) {
  return (
    <div>
      <h1>{list.name.toUpperCase()}</h1>
      <Divider />
      <div className={styles.cardRow}>
        {list.movies.slice(0, 3).map((movie: Movie) => (
          <Link href={`/movies/${movie.id}`} key={`${movie.id}_${movie.title}`}>
            <MovieCardList movie={movie} key={movie.id} />
          </Link>
        ))}
        <Link href={`/lists/${list.id}`} key={`${list.id}_${list.name}`}>
          <Button block type="primary">
            View full list
          </Button>
        </Link>
      </div>
    </div>
  );
}
