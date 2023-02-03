import { Divider } from "antd";
import Link from "next/link";
import type { List } from "../../../server/api/routers/lists";
import type { Movie } from "../../../server/api/routers/movies";
import MovieCardList from "../../cards/MovieCardList";
import styles from "./ListDetail.module.css";

const ListDetail = ({ list }: { list: List }) => {
  return (
    <>
      <h1>{list.name.toUpperCase()}</h1>
      <Divider />
      <div className={styles.cardRow}>
        {list.movies.map((movie: Movie) => (
          <Link href={`/movies/${movie.id}`} key={`${movie.id}_${movie.title}`}>
            <MovieCardList movie={movie} key={movie.id} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default ListDetail;
