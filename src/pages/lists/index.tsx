import ListDetailPreview from "../../components/detail/lists/ListDetailPreview";
import { api } from "../../utils/api";

const ListsPage = () => {
  const { data: lists, isLoading } = api.lists.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {lists?.map((list) => (
        <ListDetailPreview key={list.id} list={list} />
      ))}
    </div>
  );
};

export default ListsPage;
