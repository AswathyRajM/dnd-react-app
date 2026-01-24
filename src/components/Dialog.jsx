import { useEffect } from "react";
import "./Dialog.css";

export default function Dialog({
  open,
  heading = "Dialog Title",
  children,
  submitText = "Submit",
  cancelText = "Cancel",
  onSubmit,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="dialog_overlay" onClick={onCancel}>
      <div className="dialog_box" onClick={(e) => e.stopPropagation()}>
        <h2 className="dialog_heading">{heading}</h2>

        <div className="dialog_body">{children}</div>

        <div className="dialog_actions">
          <button className="dialog_btn secondary" onClick={onCancel}>
            {cancelText}
          </button>

          <button className="dialog_btn primary" onClick={onSubmit}>
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
}
