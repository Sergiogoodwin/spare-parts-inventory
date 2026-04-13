/**
 * Main parts table — sortable columns (PRD F-07), empty states (PRD F-01).
 * @see docs/architecture.md — PartsTable
 */

import { useMemo, useState } from 'react'
import PartRow from './PartRow.jsx'

const SORTABLE = ['name', 'sku', 'category', 'quantity', 'threshold', 'location']

function compare(a, b, key, dir) {
  const va = a[key]
  const vb = b[key]
  const mul = dir === 'asc' ? 1 : -1
  if (va == null && vb == null) return 0
  if (va == null) return 1 * mul
  if (vb == null) return -1 * mul
  if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * mul
  return String(va).localeCompare(String(vb), undefined, { sensitivity: 'base' }) * mul
}

export default function PartsTable({
  parts,
  totalCount,
  hasActiveFilter,
  onEdit,
  onDelete,
}) {
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const sortedParts = useMemo(() => {
    const copy = [...parts]
    copy.sort((a, b) => compare(a, b, sortKey, sortDir))
    return copy
  }, [parts, sortKey, sortDir])

  function toggleSort(key) {
    if (!SORTABLE.includes(key)) return
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  if (totalCount === 0) {
    return (
      <div className="parts-table-empty" role="status">
        <p>No parts yet.</p>
        <p className="parts-table-empty__hint">Add a part using the form below.</p>
      </div>
    )
  }

  if (sortedParts.length === 0 && hasActiveFilter) {
    return (
      <div className="parts-table-empty" role="status">
        <p>No parts match your search.</p>
        <p className="parts-table-empty__hint">Clear the search box to see all parts.</p>
      </div>
    )
  }

  return (
    <div className="parts-table-wrap">
      <table className="parts-table">
        <thead>
          <tr>
            {SORTABLE.map((key) => (
              <th key={key} scope="col">
                <button
                  type="button"
                  className="parts-table__sort"
                  onClick={() => toggleSort(key)}
                  aria-sort={
                    sortKey === key
                      ? sortDir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  {labelForColumn(key)}
                  {sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                </button>
              </th>
            ))}
            <th scope="col" className="parts-table__actions-head">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedParts.map((part) => (
            <PartRow key={part.id} part={part} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function labelForColumn(key) {
  const labels = {
    name: 'Name',
    sku: 'SKU',
    category: 'Category',
    quantity: 'Qty',
    threshold: 'Threshold',
    location: 'Location',
  }
  return labels[key] || key
}
