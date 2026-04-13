/**
 * Confirmation before deleting a part (PRD F-04).
 * @see docs/architecture.md — DeleteConfirm
 */

export default function DeleteConfirm({ part, onCancel, onConfirm, busy }) {
  if (!part) return null

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        className="modal modal--narrow"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
        aria-describedby="delete-confirm-desc"
      >
        <h2 id="delete-confirm-title" className="modal__title">
          Delete part?
        </h2>
        <p id="delete-confirm-desc" className="delete-confirm__body">
          This will permanently remove{' '}
          <strong>{part.name}</strong> (<code>{part.sku}</code>). This action cannot be undone.
        </p>
        <div className="form-actions modal__footer">
          <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
