/**
 * Modal to edit an existing part (PRD F-03) — user stays on table view.
 * @see docs/architecture.md — EditPartModal
 */

import { useEffect, useState } from 'react'
import * as api from '../services/api.js'

function toFormState(part) {
  if (!part) return null
  return {
    name: part.name ?? '',
    sku: part.sku ?? '',
    category: part.category ?? '',
    quantity: String(part.quantity ?? 0),
    threshold: String(part.threshold ?? 5),
    location: part.location ?? '',
    notes: part.notes ?? '',
  }
}

export default function EditPartModal({ part, onClose, onSaved }) {
  const [form, setForm] = useState(() => toFormState(part))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setForm(toFormState(part))
    setError(null)
  }, [part])

  if (!part) return null

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    if (!form.name.trim() || !form.sku.trim()) {
      return 'Name and SKU are required.'
    }
    const q = Number(form.quantity)
    const t = Number(form.threshold)
    if (!Number.isInteger(q) || q < 0) {
      return 'Quantity must be a whole number ≥ 0.'
    }
    if (!Number.isInteger(t) || t < 0) {
      return 'Threshold must be a whole number ≥ 0.'
    }
    if (form.name.length > 100) return 'Name must be at most 100 characters.'
    if (form.sku.length > 50) return 'SKU must be at most 50 characters.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const msg = validate()
    if (msg) {
      setError(msg)
      return
    }

    const body = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category.trim() || null,
      quantity: Number(form.quantity),
      threshold: Number(form.threshold),
      location: form.location.trim() || null,
      notes: form.notes.trim() || null,
    }

    setSubmitting(true)
    try {
      const updated = await api.updatePart(part.id, body)
      onSaved(updated)
      onClose()
    } catch (err) {
      setError(err.message || 'Could not save changes.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-part-title"
      >
        <header className="modal__header">
          <h2 id="edit-part-title" className="modal__title">
            Edit part
          </h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className="form-grid modal__body">
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <label className="field">
            <span className="field__label">Name *</span>
            <input
              required
              maxLength={100}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field__label">SKU *</span>
            <input
              required
              maxLength={50}
              value={form.sku}
              onChange={(e) => update('sku', e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field__label">Category</span>
            <input
              maxLength={50}
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field__label">Quantity *</span>
            <input
              type="number"
              min={0}
              step={1}
              value={form.quantity}
              onChange={(e) => update('quantity', e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field__label">Threshold *</span>
            <input
              type="number"
              min={0}
              step={1}
              value={form.threshold}
              onChange={(e) => update('threshold', e.target.value)}
            />
          </label>

          <label className="field field--wide">
            <span className="field__label">Location</span>
            <input
              maxLength={100}
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
            />
          </label>

          <label className="field field--wide">
            <span className="field__label">Notes</span>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
            />
          </label>

          <div className="form-actions modal__footer">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
