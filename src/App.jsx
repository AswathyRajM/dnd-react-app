import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/board/Home";
import BoardDetailsPage from "./pages/board/BoardDetails";
import "./App.css";

const initialBoards = [
  {
    id: "b1",
    name: "Personal Tasks",
    columns: {},
  },
  {
    id: "b2",
    name: "Work Sprint",
    columns: {},
  },
];

export default function App() {
  const [boards, setBoards] = useState(initialBoards);

  const handleCreateBoard = (name) => {
    const newBoard = {
      id: crypto.randomUUID(),
      name,
      columns: {},
    };

    setBoards((prev) => [newBoard, ...prev]);
  };

  const handleUpdateBoards = (newBoards) => {
    setBoards(newBoards);
  };

  const handleUpdateColumns = (boardId, newColumns) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, columns: newColumns } : b)),
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/boards" />} />

      <Route
        path="/boards"
        element={
          <Home
            boards={boards}
            handleUpdateBoards={handleUpdateBoards}
            handleCreateBoard={handleCreateBoard}
          />
        }
      />

      <Route
        path="/boards/:boardId"
        element={
          <BoardDetailsPage
            boards={boards}
            handleUpdateColumns={handleUpdateColumns}
          />
        }
      />
    </Routes>
  );
}
