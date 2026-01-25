import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { MdModeEditOutline, MdOutlineDelete } from "react-icons/md";
import { IoCheckmark, IoClose } from "react-icons/io5";
import Dialog from "../../components/Dialog";
import EmptyState from "../../components/EmptyState";
import { useBoards } from "../../hooks/useBoards";

export default function BoardsPage() {
  const [name, setName] = useState("");
  const [boardEditing, setBoardEditing] = useState(null);
  const [boardDeleteId, setBoardDeleteId] = useState(null);
  const navigate = useNavigate();
  const { boards, createBoard, updateBoardName, deleteBoard } = useBoards();

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createBoard(name.trim());
    setName("");
  };

  const handleEditBoardName = (e, boardId, boardName) => {
    e.stopPropagation();
    setBoardEditing({ boardId, boardName });
  };

  const handleDeleteBoardName = (e, boardId, boardName) => {
    e.stopPropagation();
    setBoardDeleteId({ boardId, boardName });
  };

  const handleNavigate = (id) => {
    if (boardEditing?.boardId === id) return;
    navigate(`/boards/${id}`);
  };

  const handleBoardNameInputChange = (e) => {
    setBoardEditing((prev) => ({
      ...prev,
      boardName: e.target.value,
    }));
  };

  const handleEditSave = () => {
    const trimmedName = boardEditing.boardName.trim();
    if (!trimmedName) return;
    updateBoardName(boardEditing.boardId, trimmedName);
    setBoardEditing(null);
  };

  const handleDeletesubmit = () => {
    deleteBoard(boardDeleteId?.boardId);
    setBoardDeleteId(null);
  };

  return (
    <>
      <div className="boards_container">
        <div className="boards_header">
          <h1 className="boards_title">Boards</h1>

          <form className="flex flex_end" onSubmit={handleCreate}>
            <input
              className="input"
              placeholder="New board name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="create_btn" type="submit">
              Create
            </button>
          </form>
        </div>

        {boards.length === 0 && (
          <EmptyState
            title="No boards to show"
            message="Create your first board to get started."
          />
        )}
        <div className="boards_grid">
          {boards?.map((board) => {
            const totalTasks = Object.values(board.lists || {}).reduce(
              (acc, list) => acc + (list.tasks?.length || 0),
              0,
            );

            return (
              <div
                key={board.id}
                className="board_card"
                onClick={() => handleNavigate(board.id)}
              >
                <div className="board_card_heading">
                  {boardEditing?.boardId === board.id ? (
                    <>
                      <input
                        className="input board_name_input"
                        value={boardEditing.boardName}
                        onChange={handleBoardNameInputChange}
                        autoFocus
                      />
                      <div className="flex">
                        <IoCheckmark
                          className="icon_btn secondary_btn"
                          onClick={handleEditSave}
                        />
                        <IoClose
                          className="icon_btn"
                          onClick={() => setBoardEditing(null)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="board_name">{board.name}</h3>
                      <div className="flex">
                        <MdModeEditOutline
                          className="icon_btn"
                          onClick={(e) =>
                            handleEditBoardName(e, board.id, board.name)
                          }
                        />
                        <MdOutlineDelete
                          className="icon_btn delete_btn"
                          onClick={(e) =>
                            handleDeleteBoardName(e, board.id, board.name)
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="board_tasks_summary">
                  <p>Total Tasks: {totalTasks}</p>
                  <ul>
                    {Object.values(board.lists || {}).map((list) => (
                      <li key={list.id}>
                        {list.name}: {list.tasks?.length || 0}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Dialog
        open={boardDeleteId?.boardId}
        heading="Are you sure you want to delete this board?"
        submitText="Delete"
        cancelText="Cancel"
        onCancel={() => setBoardDeleteId(null)}
        onSubmit={handleDeletesubmit}
      >
        <p className="dialog_board_name">{boardDeleteId?.boardName}</p>
      </Dialog>
    </>
  );
}
