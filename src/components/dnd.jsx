import { useMemo, useState } from "react";
import "./dnd.css";

const initialItems = [
  {
    id: "1",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  },
  {
    id: "2",
    text: "Integer nec odio praesent libero, sed cursus ante dapibus diam, sed nisi nulla quis sem.",
  },
  {
    id: "3",
    text: "Duis sagittis ipsum praesent mauris, fusce nec tellus sed augue semper porta, mauris massa.",
  },
  {
    id: "4",
    text: "Curabitur sodales ligula in libero, sed dignissim lacinia nunc, curabitur tortor pellentesque nibh.",
  },
  {
    id: "5",
    text: "Aenean quam in scelerisque sem at dolor, maecenas mattis sed convallis tristique sem proin.",
  },
];

function reorder(list, fromIndex, toIndex) {
  const updated = [...list];
  const [removed] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, removed);
  return updated;
}

export default function App() {
  const [items, setItems] = useState(initialItems);

  const [draggingId, setDraggingId] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const draggingIndex = useMemo(() => {
    return items.findIndex((x) => x.id === draggingId);
  }, [items, draggingId]);

  const handleDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOverItem = (e, index) => {
    e.preventDefault();
    setOverIndex(index);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (draggingId == null || overIndex == null) {
      setDraggingId(null);
      setOverIndex(null);
      return;
    }

    if (draggingIndex === -1 || draggingIndex === overIndex) {
      setDraggingId(null);
      setOverIndex(null);
      return;
    }

    setItems((prev) => reorder(prev, draggingIndex, overIndex));

    setDraggingId(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setOverIndex(null);
  };

  return (
    <div className="main_container">
      <div
        className="droppable_container"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {items.map((item, index) => {
          const isDragging = item.id === draggingId;
          const showPlaceholder = overIndex === index && draggingId !== item.id;

          return (
            <div key={item.id} className="item_wrapper">
              {showPlaceholder && <div className="placeholder" />}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={(e) => handleDragOverItem(e, index)}
                onDragEnd={handleDragEnd}
                className={`draggable_item ${isDragging ? "dragging" : ""}`}
              >
                {item.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
