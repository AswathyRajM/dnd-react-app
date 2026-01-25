import { useMemo, useRef, useState } from "react";
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
  const [lists, setCloumns] = useState(board?.lists || {});
  const [newColumnName, setNewColumnName] = useState("");
  const [newItem, setNewItem] = useState("");
  const [addingColumn, setAddingColumn] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [dragSize, setDragSize] = useState({ w: 0, h: 0 });

  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(null);
  const overRef = useRef(null);

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

  const getDraggedItem = () => {
    if (!draggingRef.current) return null;
    const { fromColumn, fromIndex } = draggingRef.current;
    return lists[fromColumn]?.tasks?.[fromIndex] || null;
  };

  const handlePointerDown = (e, itemId, fromColumn, fromIndex) => {
    e.preventDefault();
    if (e.pointerType === "mouse" && e.button !== 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragSize({ w: rect.width, h: rect.height });

    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const dragMeta = { id: itemId, fromColumn, fromIndex };
    setDragging(dragMeta);
    draggingRef.current = dragMeta;

    setDragPos({ x: e.clientX, y: e.clientY });

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;

    setDragPos({ x: e.clientX, y: e.clientY });

    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;

    const colKey = el.closest("[data-col]")?.getAttribute("data-col");
    const indexAttr = el.closest("[data-index]")?.getAttribute("data-index");

    if (!colKey) return;

    let toIndex = 0;

    if (indexAttr !== null && indexAttr !== undefined) {
      toIndex = Number(indexAttr);
    } else {
      toIndex = lists[colKey]?.tasks?.length || 0;
    }

    const newOver = { toColumn: colKey, toIndex };
    overRef.current = newOver;
    setOver(newOver);

    e.preventDefault();
  };

  const finishDrop = () => {
    const currentDragging = draggingRef.current;
    const currentOver = overRef.current;

    if (!currentDragging || !currentOver) {
      setDragging(null);
      setOver(null);
      draggingRef.current = null;
      overRef.current = null;
      return;
    }

    const { fromColumn, fromIndex } = currentDragging;
    const { toColumn, toIndex } = currentOver;

    if (fromColumn === toColumn && fromIndex === toIndex) {
      setDragging(null);
      setOver(null);
      draggingRef.current = null;
      overRef.current = null;
      return;
    }

    let updated;

    if (fromColumn === toColumn) {
      updated = {
        ...lists,
        [fromColumn]: {
          ...lists[fromColumn],
          tasks: reorder(lists[fromColumn].tasks, fromIndex, toIndex),
        },
      };
    } else {
      const result = moveItem(
        lists[fromColumn].tasks,
        lists[toColumn].tasks,
        fromIndex,
        toIndex,
      );

      updated = {
        ...lists,
        [fromColumn]: { ...lists[fromColumn], tasks: result.source },
        [toColumn]: { ...lists[toColumn], tasks: result.destination },
      };
    }

    setCloumns(updated);
    handleUpdateLists(board.id, updated);

    setDragging(null);
    setOver(null);
    draggingRef.current = null;
    overRef.current = null;
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    finishDrop();
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

  const draggedItem = getDraggedItem();

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

        <div
          className="board_lists"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {Object.keys(lists).map((colKey) => {
            const column = lists[colKey];

            return (
              <div key={colKey} className="column" data-col={colKey}>
                <div className="board_card_heading">
                  <h2 className="board_name">{column?.name}</h2>
                  <IoAdd
                    className="icon_btn"
                    onClick={() => handleToggleCreateColumnDialog(colKey)}
                  />
                </div>

                <div className="column_body">
                  {column?.tasks?.map((item, index) => {
                    const isDragging = dragging?.id === item.id;

                    const showPlaceholder =
                      over?.toColumn === colKey &&
                      over?.toIndex === index &&
                      dragging?.id !== item.id;

                    return (
                      <div key={item.id} className="card_wrap">
                        {showPlaceholder && <div className="placeholder" />}

                        <div
                          className={`card ${isDragging ? "card_dragging" : ""}`}
                          data-index={index}
                          onPointerDown={(e) =>
                            handlePointerDown(e, item.id, colKey, index)
                          }
                        >
                          {item.text}
                        </div>
                      </div>
                    );
                  })}

                  {over?.toColumn === colKey &&
                    over?.toIndex === column.tasks.length && (
                      <div className="placeholder end_placeholder" />
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview */}
      {dragging && draggedItem && (
        <div
          className="drag_preview"
          style={{
            left: dragPos.x - dragOffsetRef.current.x,
            top: dragPos.y - dragOffsetRef.current.y,
            "--drag-w": `${dragSize.w}px`,
            "--drag-h": `${dragSize.h}px`,
          }}
        >
          {draggedItem.text}
        </div>
      )}

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
