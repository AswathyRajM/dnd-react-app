import { useMemo, useState } from "react";
import "./DragNDrop.css";

const initialData = {
  todo: [
    {
      id: "t1",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    },
    {
      id: "t2",
      text: "Suspendisse potenti, sed dignissim lacinia nunc, curabitur tortor pellentesque nibh.",
    },
  ],
  doing: [
    {
      id: "d1",
      text: "Praesent mauris, fusce nec tellus sed augue semper porta, mauris massa.",
    },
  ],
  done: [
    {
      id: "dn1",
      text: "Integer nec odio praesent libero, sed cursus ante dapibus diam, sed nisi.",
    },
  ],
};

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

export default function App() {
  const [columns, setColumns] = useState(initialData);

  const [dragging, setDragging] = useState(null);
  // dragging = { id, fromColumn, fromIndex }

  const [over, setOver] = useState(null);
  // over = { toColumn, toIndex }

  const allItems = useMemo(() => {
    return Object.entries(columns).flatMap(([colId, items]) =>
      items.map((item, index) => ({
        ...item,
        colId,
        index,
      })),
    );
  }, [columns]);

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

    // if dragging over empty space, allow dropping at end
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

    // Same column reorder
    if (fromColumn === toColumn) {
      if (fromIndex === toIndex) {
        setDragging(null);
        setOver(null);
        return;
      }

      setColumns((prev) => ({
        ...prev,
        [fromColumn]: reorder(prev[fromColumn], fromIndex, toIndex),
      }));
    } else {
      // Move between columns
      setColumns((prev) => {
        const result = moveItem(
          prev[fromColumn],
          prev[toColumn],
          fromIndex,
          toIndex,
        );

        return {
          ...prev,
          [fromColumn]: result.source,
          [toColumn]: result.destination,
        };
      });
    }

    setDragging(null);
    setOver(null);
  };

  const handleDragEnd = () => {
    setDragging(null);
    setOver(null);
  };

  return (
    <div className="boards_container">
      <h1 className="board_title">Mini Trello Board</h1>

      <div className="board">
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
                <span className="column_count">{items.length}</span>
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
                        onDragStart={(e) =>
                          handleDragStart(e, item.id, colKey, index)
                        }
                        onDragOver={(e) => handleDragOverItem(e, colKey, index)}
                        onDragEnd={handleDragEnd}
                        className={`card ${isDragging ? "card_dragging" : ""}`}
                      >
                        {item.text}
                      </div>
                    </div>
                  );
                })}

                {/* Drop at end placeholder */}
                {over?.toColumn === colKey &&
                  over?.toIndex === items.length &&
                  dragging?.fromColumn !== colKey && (
                    <div className="placeholder end_placeholder" />
                  )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="board_footer">
        Drag cards to reorder inside a column or move between columns (no
        library used).
      </p>
    </div>
  );
}
