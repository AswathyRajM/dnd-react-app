import { useState } from "react";
import "./App.css";
import DragDrop from "./components/dnd";

function App() {
  return (
    <div className="container">
      <h1>Drag and Drop</h1>
      <DragDrop />
    </div>
  );
}

export default App;
