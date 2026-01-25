import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import "./BoardDetails.css";
import Dialog from "../../components/Dialog";
import EmptyState from "../../components/EmptyState";
import { IoMdArrowBack } from "react-icons/io";
import { moveItem, reorder } from "../../util/boardHelpers";

export default function BoardDetailsPage({ boards, handleUpdateLists }) {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const board = useMemo(
    () => boards.find((b) => b.id === boardId),
    [boards, boardId],
  );

  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);
  const [lists, setCloumns] = useState(board.lists);
  const [newColumnName, setNewColumnName] = useState("");
  const [newItem, setNewItem] = useState("");
  const [addingColumn, setAddingColumn] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleCreateColumn = (e) => {
    e.preventDefault();

    const trimmedName = newColumnName.trim();
    if (!trimmedName) return;

    const listKey = trimmedName.toLowerCase().replace(/\s+/g, "_");

    if (board.lists[listKey]) return;

    const updatedLists = {
      ...board.lists,
      [listKey]: {
        id: listKey,
        name: trimmedName,
        tasks: [],
      },
    };

    setCloumns(updatedLists);
    handleUpdateLists(board.id, updatedLists);

    setNewColumnName("");
  };

  if (!board) {
    return (
      <div className="board_details_page">
        <h2>Board not found</h2>
        <button className="back_btn" onClick={() => navigate("/boards")}>
          Back to Boards
        </button>
      </div>
    );
  }

  const handleDragStart = (e, itemId, fromColumn, fromIndex) => {
    setDragging({ id: itemId, fromColumn, fromIndex });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", itemId);
  };

  const handleDragOverItem = (e, toColumn, toIndex) => {
    e.preventDefault();
    setOver({ toColumn, toIndex });
  };

  const handleDragOverColumn = (e, toColumn) => {
    e.preventDefault();
    setOver((prev) => {
      if (!prev || prev.toColumn !== toColumn) {
        return { toColumn, toIndex: lists[toColumn].length };
      }
      return prev;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (!dragging || !over) {
      setDragging(null);
      setOver(null);
      return;
    }

    const { fromColumn, fromIndex } = dragging;
    const { toColumn, toIndex } = over;

    if (fromColumn === toColumn) {
      if (fromIndex === toIndex) {
        setDragging(null);
        setOver(null);
        return;
      }

      const updated = {
        ...lists,
        [fromColumn]: reorder(lists[fromColumn], fromIndex, toIndex),
      };

      handleUpdateLists(board.id, updated);
    } else {
      // move between lists
      const result = moveItem(
        lists[fromColumn],
        lists[toColumn],
        fromIndex,
        toIndex,
      );

      const updated = {
        ...lists,
        [fromColumn]: result.source,
        [toColumn]: result.destination,
      };

      handleUpdateLists(board.id, updated);
    }

    setDragging(null);
    setOver(null);
  };

  const handleDragEnd = () => {
    setDragging(null);
    setOver(null);
  };

  const handleToggleCreateColumnDialog = (colKey = "") => {
    if (colKey) {
      setNewItem("");
      setAddingColumn(colKey);
    }
    setOpenCreateDialog(!openCreateDialog);
  };

  const handleCreateItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;

    handleToggleCreateColumnDialog();

    const list = lists[addingColumn];
    if (!list) return;

    const updatedTasks = [
      ...(list.tasks || []),
      { id: crypto.randomUUID(), text: trimmed },
    ];

    const updatedLists = {
      ...lists,
      [addingColumn]: {
        ...list,
        tasks: updatedTasks,
      },
    };

    setCloumns(updatedLists);
    handleUpdateLists(board.id, updatedLists);

    setNewItem("");
  };

  return (
    <>
      <div className="boards_container">
        <div className="boards_header">
          <div className="boards_title">
            <button
              className="back_btn flex"
              onClick={() => navigate("/boards")}
            >
              <IoMdArrowBack />
              Back
            </button>
            <h1 className="board_name_title">{board.name}</h1>
          </div>

          <form className="flex flex_end" onSubmit={handleCreateColumn}>
            <input
              className="input"
              type="text"
              placeholder="Enter new column name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
            <button className="create_btn" type="submit">
              Create
            </button>
          </form>
        </div>
        {Object.keys(lists).length === 0 && (
          <EmptyState
            title="No items to show"
            message="Add a new item to this column."
          />
        )}
        <div className="board_lists">
          {Object.keys(lists).map((colKey) => {
            const items = lists[colKey];

            console.log({ lists, colKey, board, items });
            return (
              <div
                key={colKey}
                className="column"
                onDragOver={(e) => handleDragOverColumn(e, colKey)}
                onDrop={handleDrop}
              >
                <div className="column_header">
                  <h2 className="column_title">{items?.name}</h2>
                  <IoAdd
                    className="icon_btn"
                    onClick={() => {
                      handleToggleCreateColumnDialog(colKey);
                    }}
                  />
                </div>

                <div className="column_body">
                  {items?.tasks?.map((item, index) => {
                    const isDragging = dragging?.id === item.id;

                    const showPlaceholder =
                      over?.toColumn === colKey &&
                      over?.toIndex === index &&
                      dragging?.id !== item.id;

                    return (
                      <div key={item.id} className="card_wrap">
                        {showPlaceholder && <div className="placeholder" />}

                        <div
                          draggable
                          className={`card ${isDragging ? "card_dragging" : ""}`}
                          onDragStart={(e) =>
                            handleDragStart(e, item.id, colKey, index)
                          }
                          onDragOver={(e) =>
                            handleDragOverItem(e, colKey, index)
                          }
                          onDragEnd={handleDragEnd}
                        >
                          {item.text}1
                        </div>
                      </div>
                    );
                  })}

                  {over?.toColumn === colKey &&
                    over?.toIndex === items.tasks.length && (
                      <div className="placeholder end_placeholder" />
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog
        open={openCreateDialog}
        heading="Create New Item"
        submitText="Create"
        cancelText="Cancel"
        onCancel={handleToggleCreateColumnDialog}
        onSubmit={handleCreateItem}
      >
        <div className="flex flex_end">
          <textarea
            type="text"
            placeholder="Enter new item name"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            autoFocus
            rows={4}
          />
        </div>
      </Dialog>
    </>
  );
}
