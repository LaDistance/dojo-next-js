import MovieListPreview from "../../components/detail/lists/MovieListPreview";
import { api } from "../../utils/api";

const ListsPage = () => {
  const { data: lists, isLoading } = api.lists.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* <div>
        {lists?.map((list) => (
          <Card title={list.name} key={list.id}>
            {list.movies.map((movie) => (
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
          </Card>
        ))}
      </div> */}
      {lists?.map((list) => (
        <MovieListPreview key={list.id} list={list} />
      ))}
    </div>
  );
};

export default ListsPage;
