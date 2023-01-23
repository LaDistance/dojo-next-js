import { type NextPage } from "next";
import Link from "next/link";
import styles from "./index.module.css";

import { useEffect, useState } from "react";
import MovieCard from "../components/cards/MovieCard";
import { IMovie } from "../types/movie";

const Home: NextPage = () => {
  const [movies, setMovies] = useState<IMovie[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/movies/popular");
      const data = await response.json();
      setMovies(data.results);
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <>
      <div className={styles.cardRow}>
        {movies?.map((movie) => (
          <Link
            href={`/movies/${movie.id}`}
            key={movie.title + movie.release_date}
          >
            <MovieCard movie={movie} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
