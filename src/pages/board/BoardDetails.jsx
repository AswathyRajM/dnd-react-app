import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import "./BoardDetails.css";
import Dialog from "../../components/Dialog";

function reorder(list, fromIndex, toIndex) {
  const updated = [...list];
  const [removed] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, removed);
  return updated;
}

function moveItem(sourceList, destList, fromIndex, toIndex) {
  const sourceClone = [...sourceList];
  const destClone = [...destList];

  const [removed] = sourceClone.splice(fromIndex, 1);
  destClone.splice(toIndex, 0, removed);

  return {
    source: sourceClone,
    destination: destClone,
  };
}

export default function BoardDetailsPage({ boards, handleUpdateColumns }) {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const board = useMemo(
    () => boards.find((b) => b.id === boardId),
    [boards, boardId],
  );

  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);
  const [columns, setCloumns] = useState(board.columns);
  const [newColumnName, setNewColumnName] = useState("");
  const [newItem, setNewItem] = useState("");
  const [addingColumn, setAddingColumn] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleCreateColumn = (e) => {
    e.preventDefault();
    const trimmedName = newColumnName.trim();
    if (!trimmedName) return;

    const updatedColumns = {
      ...board.columns,
      [trimmedName]: [],
    };

    setCloumns(updatedColumns);

    handleUpdateColumns(board.id, updatedColumns);

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
        return { toColumn, toIndex: columns[toColumn].length };
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

    // reorder inside same column
    if (fromColumn === toColumn) {
      if (fromIndex === toIndex) {
        setDragging(null);
        setOver(null);
        return;
      }

      const updated = {
        ...columns,
        [fromColumn]: reorder(columns[fromColumn], fromIndex, toIndex),
      };

      handleUpdateColumns(board.id, updated);
    } else {
      // move between columns
      const result = moveItem(
        columns[fromColumn],
        columns[toColumn],
        fromIndex,
        toIndex,
      );

      const updated = {
        ...columns,
        [fromColumn]: result.source,
        [toColumn]: result.destination,
      };

      handleUpdateColumns(board.id, updated);
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
    if (!newItem.trim()) return;

    handleToggleCreateColumnDialog();

    const items = columns[addingColumn];
    const updatedItems = [
      ...items,
      { id: Date.now().toString(), text: newItem.trim() },
    ];

    const updatedColumns = {
      ...columns,
      [addingColumn]: updatedItems,
    };
    setCloumns(updatedColumns);

    handleUpdateColumns(board.id, updatedColumns);
  };

  return (
    <>
      <div className="boards_container">
        <div className="boards_header">
          <div className="boards_title">
            <button className="back_btn" onClick={() => navigate("/boards")}>
              ← Back
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

        <div className="board_columns">
          {Object.keys(columns).map((colKey) => {
            const items = columns[colKey];

            return (
              <div
                key={colKey}
                className="column"
                onDragOver={(e) => handleDragOverColumn(e, colKey)}
                onDrop={handleDrop}
              >
                <div className="column_header">
                  <h2 className="column_title">{colKey}</h2>
                  <IoAdd
                    className="icon_btn"
                    onClick={() => {
                      handleToggleCreateColumnDialog(colKey);
                    }}
                  />
                </div>

                <div className="column_body">
                  {items.map((item, index) => {
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
                          {item.text}
                        </div>
                      </div>
                    );
                  })}

                  {over?.toColumn === colKey &&
                    over?.toIndex === items.length && (
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
        heading="Crete New Item"
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
