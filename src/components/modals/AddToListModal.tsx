import { Button, Divider, Input, InputRef, Modal, Select, Space } from "antd";
import type { Movie } from "../../server/api/routers/movies";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { api } from "../../utils/api";

export const AddToListModal = ({
  movie,
  visible,
  setVisible,
}: {
  movie: Movie;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const createListWithMovie = api.lists.createListWithMovie.useMutation();
  const { data, isLoading, isError, error } = api.lists.getAll.useQuery();

  const inputRef = useRef<InputRef>(null);
  const [name, setName] = useState("");

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    // Do the mutation of creation of both list and movie
    createListWithMovie.mutate({
      listName: name,
      movie: {
        id: `${movie.id}`,
        title: movie.title,
        release_date: new Date(movie.release_date),
        image_path: movie.poster_path,
        overview: movie.overview,
      },
    });

    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Modal
      title="Add to List"
      open={visible}
      onOk={() => {
        setVisible(false);
      }}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <>
        <Select
          style={{ width: "100%" }}
          placeholder="Select a list"
          options={data.map((list) => ({ label: list.name, value: list.id }))}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: "8px 0" }} />
              <Space style={{ padding: "0 8px 4px" }}>
                <Input
                  placeholder="Please enter item"
                  ref={inputRef}
                  value={name}
                  onChange={onNameChange}
                />
                <Button type="text" onClick={addItem}>
                  Add item
                </Button>
              </Space>
            </>
          )}
        />
      </>
    </Modal>
  );
};
