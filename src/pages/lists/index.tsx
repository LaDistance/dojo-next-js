import type { NextPage } from "next";
import ListDetailPreview from "../../components/detail/lists/ListDetailPreview";
import { api } from "../../utils/api";

const ListsPage: NextPage = () => {
  const { data: lists, isLoading } = api.lists.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {lists && lists.length > 0 ? (
        lists.map((list) => <ListDetailPreview key={list.id} list={list} />)
      ) : (
        <h3>No lists to display</h3>
      )}
    </div>
  );
};

export default ListsPage;
