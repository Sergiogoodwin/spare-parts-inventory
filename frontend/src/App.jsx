/**
 * Spare Parts Inventory — root UI (React 18 + Vite, plain CSS).
 * @see docs/architecture.md — App / component tree
 * @see docs/prd.md — F-01 … F-07
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import * as api from './services/api.js'
import PartsTable from './components/PartsTable.jsx'
import SearchBar from './components/SearchBar.jsx'
import AddPartForm from './components/AddPartForm.jsx'
import EditPartModal from './components/EditPartModal.jsx'
import DeleteConfirm from './components/DeleteConfirm.jsx'

const INVENTORY_CSS = `
.inventory-app {
  text-align: left;
  padding: 1.5rem 1.25rem 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
.inventory-app__title {
  margin: 0 0 0.25rem;
  font-size: 1.75rem;
  letter-spacing: -0.02em;
}
.inventory-app__subtitle {
  margin: 0 0 1.5rem;
  color: var(--text);
  font-size: 0.95rem;
}
.inventory-app__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1rem;
}
.inventory-app__banner {
  padding: 0.65rem 0.85rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid var(--border);
  background: var(--code-bg);
  color: var(--text-h);
}
.inventory-app__banner--error {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.12);
}

.panel {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem 1.1rem 1.15rem;
  margin-top: 1.5rem;
  background: var(--bg);
}
.panel__title {
  margin: 0 0 0.85rem;
  font-size: 1.1rem;
  color: var(--text-h);
}

.search-bar { flex: 1 1 220px; min-width: 180px; }
.search-bar__label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
  color: var(--text-h);
}
.search-bar__input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font: inherit;
  color: var(--text-h);
  background: var(--bg);
}

.parts-table-wrap { overflow-x: auto; }
.parts-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}
.parts-table th,
.parts-table td {
  border-bottom: 1px solid var(--border);
  padding: 0.55rem 0.5rem;
  text-align: left;
  vertical-align: middle;
}
.parts-table thead th {
  font-weight: 600;
  color: var(--text-h);
  background: var(--code-bg);
}
.parts-table__sort {
  font: inherit;
  font-weight: 600;
  color: inherit;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
}
.parts-table__sort:hover { text-decoration: underline; }
.parts-table__actions-head { text-align: right; width: 9rem; }

.part-row__sku {
  font-size: 0.85em;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  background: var(--code-bg);
}
.part-row__num { font-variant-numeric: tabular-nums; }
.part-row__actions {
  text-align: right;
  white-space: nowrap;
}
.part-row__actions .btn { margin-left: 0.35rem; }
.part-row--low-stock {
  background: rgba(251, 191, 36, 0.18);
}
.part-row--low-stock td:first-child {
  box-shadow: inset 3px 0 0 0 #d97706;
}

.parts-table-empty {
  padding: 1.5rem 1rem;
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: 8px;
  color: var(--text-h);
}
.parts-table-empty__hint {
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  color: var(--text);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem 1rem;
}
.field { display: flex; flex-direction: column; gap: 0.3rem; }
.field--wide { grid-column: 1 / -1; }
.field__label { font-size: 0.8rem; font-weight: 600; color: var(--text-h); }
.field input,
.field textarea {
  font: inherit;
  padding: 0.45rem 0.55rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-h);
  background: var(--bg);
}
.form-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.25rem;
}
.form-error {
  grid-column: 1 / -1;
  margin: 0;
  color: #b45309;
  font-size: 0.9rem;
}

.btn {
  font: inherit;
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  cursor: pointer;
  background: var(--bg);
  color: var(--text-h);
}
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn--primary {
  background: var(--accent);
  color: #fff;
  border-color: transparent;
}
.btn--secondary { background: var(--code-bg); }
.btn--danger {
  background: #b91c1c;
  color: #fff;
  border-color: transparent;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
}
.modal {
  width: min(520px, 100%);
  max-height: 90vh;
  overflow: auto;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: var(--shadow);
  padding: 1rem 1.1rem 1.1rem;
}
.modal--narrow { width: min(400px, 100%); }
.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.modal__title { margin: 0; font-size: 1.15rem; color: var(--text-h); }
.modal__close {
  border: none;
  background: transparent;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--text);
  padding: 0.15rem 0.35rem;
}
.modal__body { margin-top: 0.25rem; }
.modal__footer { margin-top: 0.75rem; }

.delete-confirm__body { margin: 0 0 1rem; color: var(--text); line-height: 1.45; }
`

export default function App() {
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [search, setSearch] = useState('')
  const [editingPart, setEditingPart] = useState(null)
  const [deletingPart, setDeletingPart] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const refreshParts = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const data = await api.getParts()
      setParts(Array.isArray(data) ? data : [])
    } catch (e) {
      setLoadError(e.message || 'Failed to load parts.')
      setParts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshParts()
  }, [refreshParts])

  const filteredParts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return parts
    return parts.filter((p) => {
      const name = (p.name || '').toLowerCase()
      const cat = (p.category || '').toLowerCase()
      return name.includes(q) || cat.includes(q)
    })
  }, [parts, search])

  const hasActiveFilter = search.trim().length > 0

  function handleCreated(part) {
    setParts((prev) => [...prev, part])
  }

  function handleSaved(updated) {
    setParts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  async function handleDeleteConfirm() {
    if (!deletingPart) return
    setDeleteBusy(true)
    try {
      await api.deletePart(deletingPart.id)
      setParts((prev) => prev.filter((p) => p.id !== deletingPart.id))
      setDeletingPart(null)
    } catch (e) {
      setLoadError(e.message || 'Failed to delete part.')
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: INVENTORY_CSS }} />
      <div className="inventory-app">
        <h1 className="inventory-app__title">Spare parts inventory</h1>
        <p className="inventory-app__subtitle">
          Local inventory — React UI on port 5173, Flask API on port 5000.
        </p>

        {loadError ? (
          <div className="inventory-app__banner inventory-app__banner--error" role="alert">
            {loadError}
          </div>
        ) : null}

        <div className="inventory-app__toolbar">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {loading ? (
          <div className="inventory-app__banner" role="status">
            Loading parts…
          </div>
        ) : (
          <PartsTable
            parts={filteredParts}
            totalCount={parts.length}
            hasActiveFilter={hasActiveFilter}
            onEdit={setEditingPart}
            onDelete={setDeletingPart}
          />
        )}

        <AddPartForm onCreated={handleCreated} />

        <EditPartModal
          key={editingPart ? `edit-${editingPart.id}` : 'edit-closed'}
          part={editingPart}
          onClose={() => setEditingPart(null)}
          onSaved={handleSaved}
        />

        <DeleteConfirm
          part={deletingPart}
          onCancel={() => !deleteBusy && setDeletingPart(null)}
          onConfirm={handleDeleteConfirm}
          busy={deleteBusy}
        />
      </div>
    </>
  )
}
