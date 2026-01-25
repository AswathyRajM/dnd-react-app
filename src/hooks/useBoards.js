import { useState, useEffect } from "react";
import { initialBoards } from "../util/boardHelpers";

export function useBoards() {
  const [boards, setBoards] = useState(() => {
    const saved = localStorage.getItem("boards");
    if (saved) return JSON.parse(saved);
    localStorage.setItem("boards", JSON.stringify(initialBoards));
    return initialBoards;
  });

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  const createBoard = (name) => {
    const newBoard = {
      id: crypto.randomUUID(),
      name,
      lists: {},
    };
    setBoards((prev) => [newBoard, ...prev]);
  };

  const updateBoardName = (boardId, newName) => {
    const updatedBoards = boards.map((b) =>
      b.id === boardId ? { ...b, name: newName } : b,
    );
    setBoards(updatedBoards);
  };

  const deleteBoard = (boardId) => {
    const updatedBoards = boards.filter((b) => b.id !== boardId);
    setBoards(updatedBoards);
  };

  const createColumn = (boardId, columnName) => {
    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== boardId) return b;

        const key = columnName.toLowerCase().replace(/\s+/g, "_");
        if (b.lists[key]) return b; // avoid duplicates

        return {
          ...b,
          lists: {
            ...b.lists,
            [key]: { id: key, name: columnName, tasks: [] },
          },
        };
      }),
    );
  };

  const createTask = ({ boardId, addingColumn, taskName }) => {
    const updated = boards.map((board) => {
      if (board.id !== boardId) return board;
      const list = board.lists[addingColumn];
      if (!list) return board;

      return {
        ...board,
        lists: {
          ...board.lists,
          [addingColumn]: {
            ...list,
            tasks: [...list.tasks, { id: crypto.randomUUID(), text: taskName }],
          },
        },
      };
    });
    console.log(updated);

    setBoards(updated);
  };

  const updateTasks = (boardId, listKey, tasks) => {
    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          lists: {
            ...b.lists,
            [listKey]: { ...b.lists[listKey], tasks },
          },
        };
      }),
    );
  };

  return {
    boards,
    setBoards,
    createBoard,
    createColumn,
    createTask,
    updateBoardName,
    updateTasks,
    deleteBoard,
  };
}
