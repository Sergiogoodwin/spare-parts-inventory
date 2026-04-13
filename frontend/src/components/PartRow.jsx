/**
 * Single table row; owns low-stock highlight when quantity ≤ threshold.
 * @see docs/architecture.md — PartRow, low-stock on frontend
 */

export default function PartRow({ part, onEdit, onDelete }) {
  const lowStock =
    typeof part.quantity === 'number' &&
    typeof part.threshold === 'number' &&
    part.quantity <= part.threshold

  return (
    <tr className={lowStock ? 'part-row part-row--low-stock' : 'part-row'}>
      <td>{part.name}</td>
      <td>
        <code className="part-row__sku">{part.sku}</code>
      </td>
      <td>{part.category ?? '—'}</td>
      <td className="part-row__num">{part.quantity}</td>
      <td className="part-row__num">{part.threshold}</td>
      <td>{part.location ?? '—'}</td>
      <td className="part-row__actions">
        <button type="button" className="btn btn--secondary" onClick={() => onEdit(part)}>
          Edit
        </button>
        <button type="button" className="btn btn--danger" onClick={() => onDelete(part)}>
          Delete
        </button>
      </td>
    </tr>
  )
}
