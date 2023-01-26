import { Card } from "antd";
import MovieCard from "../../components/cards/MovieCard";
import { api } from "../../utils/api";

const ListsPage = () => {
  const { data: lists, isLoading } = api.lists.getAll.useQuery();
  const { data: movies } = api.movies.getPopular.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div>
        {lists?.map((list) => (
          <Card title={list.name} key={list.id} >
            {list.movies.map((movie) => (
                <MovieCard enableButton={false} movie={{
                    id: parseInt(movie.id),
                    title: movie.title,
                    poster_path: movie.image_path,
                    release_date: movie.release_date.toISOString(),
                    overview: movie.overview,
                }} key={movie.id} />
            ))}
          </Card>
          ))}
      </div>
      {/* <div>
        {movies?.map((movie) => (
          <MovieCard enableButton movie={movie} key={movie.id} />
        ))}
      </div> */}
    </div>
  );
};

export default ListsPage;
