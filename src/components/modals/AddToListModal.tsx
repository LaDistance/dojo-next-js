import type { SelectValue } from "antd/es/tree-select";
import type { Dispatch, SetStateAction } from "react";
import type { Movie } from "../../server/api/routers/movies";
import type { NamedObject } from "../../types/general";

import { Button, Divider, Input, Modal, Select, Space } from "antd";
import { useState } from "react";
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
  const createListWithMovie = api.lists.createListWithMovie.useMutation({
    onSuccess: (data) => {
      setSelectedList({ id: data.list.id, name: data.list.name });
    },
  });
  const addMovieToList = api.lists.addMovieToList.useMutation();
  const { data, isLoading, isError, error } = api.lists.getAll.useQuery();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedList, setSelectedList] = useState<NamedObject | undefined>(
    undefined
  );

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onSelectList = (
    value: SelectValue,
    option: {
      label: string;
      value: number;
    }
  ) => {
    setSelectedList({ id: option.value, name: option.label });
  };

  // Handlers
  const createList = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    // Do the mutation of creation of both list and movie
    createListWithMovie.mutate({
      listName: name,
      movie: {
        ...movie,
        release_date: new Date(movie.release_date),
      },
    });

    setOpen(false);
    setName("");
  };

  const updateList = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    // Do the mutation of adding a movie to a list
    addMovieToList.mutate({
      listId: selectedList?.id || 0,
      movie: {
        ...movie,
        release_date: new Date(movie.release_date),
      },
    });

    setOpen(false);
    setName("");
  };

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Modal
      title="Add to List"
      open={visible}
      onOk={(event) => {
        setVisible(false);
        updateList(event);
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
          onSelect={onSelectList}
          open={open}
          onDropdownVisibleChange={(visible) => setOpen(visible)}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: "8px 0" }} />
              <Space style={{ padding: "0 8px 4px" }}>
                <Input
                  placeholder="Please enter item"
                  value={name}
                  onChange={onNameChange}
                />
                <Button type="text" onClick={createList}>
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
