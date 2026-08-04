function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="confirm-dialog-overlay"
      role="presentation"
      onClick={onCancel}
    >
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-dialog-title">{title}</h2>

        {message && <p>{message}</p>}

        <div className="confirm-dialog-actions">
          <button
            className="confirm-dialog-cancel"
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>

          <button
            className="confirm-dialog-confirm"
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmDialog;
