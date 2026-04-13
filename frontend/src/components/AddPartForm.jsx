/**
 * Form to create a new part (PRD F-02) — POST /api/parts.
 * @see docs/architecture.md — AddPartForm
 */

import { useState } from 'react'
import * as api from '../services/api.js'

const initial = {
  name: '',
  sku: '',
  category: '',
  quantity: '0',
  threshold: '5',
  location: '',
  notes: '',
}

export default function AddPartForm({ onCreated }) {
  const [form, setForm] = useState(initial)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

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
      const created = await api.createPart(body)
      onCreated(created)
      setForm(initial)
    } catch (err) {
      setError(err.message || 'Could not create part.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="panel add-part-form" aria-labelledby="add-part-heading">
      <h2 id="add-part-heading" className="panel__title">
        Add part
      </h2>
      <form onSubmit={handleSubmit} className="form-grid">
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
            rows={2}
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Add part'}
          </button>
        </div>
      </form>
    </section>
  )
}
