import "./EmptyState.css";

export default function EmptyState({
  title = "Nothing here",
  message = "Create something to get started.",
  actionText,
  onAction,
}) {
  return (
    <div className="empty_container">
      <div className="empty_state">
        <h3 className="empty_state_title">{title}</h3>
        <p className="empty_state_message">{message}</p>

        {actionText && (
          <button className="empty_state_btn" onClick={onAction}>
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
}
