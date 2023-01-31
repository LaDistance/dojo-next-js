import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ListDetail from "../../components/detail/lists/ListDetail";
import { api } from "../../utils/api";

const ListDetailPage = () => {
  const router = useRouter();
  const [listId, setlistId] = useState<number>(-1);

  useEffect(() => {
    if (!router.isReady) return;
    const query = router.query;
    if (!query.id) return;
    if (typeof query.id !== "string") {
      setlistId(parseInt(query.id[0] as string));
    } else {
      setlistId(parseInt(query.id));
    }
  }, [router.asPath, router.isReady, router.query]);

  const list = api.lists.getById.useQuery(
    { id: listId },
    { enabled: !!listId }
  );

  if (list.isLoading) return <div>Loading...</div>;

  if (list.isError) return <div>Error: {list.error.message}</div>;

  return (
    <div>
      <ListDetail key={listId} list={list.data} />
    </div>
  );
};

export default ListDetailPage;
