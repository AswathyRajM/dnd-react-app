import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/board/Home";
import BoardDetailsPage from "./pages/board/BoardDetails";
import "./App.css";
import { initialBoards } from "./util/boardHelpers";

export default function App() {
  const [boards, setBoards] = useState(initialBoards);

  const handleUpdateLists = (boardId, newLists) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, lists: newLists } : b)),
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/boards" />} />
      <Route path="/boards" element={<Home />} />

      <Route
        path="/boards/:boardId"
        element={<BoardDetailsPage boards={boards} />}
      />
    </Routes>
  );
}
