/**
 * All HTTP calls to the Flask backend (base URL per architecture).
 * @see docs/architecture.md — Base URL: http://localhost:5000/api
 */

const API_BASE = 'http://localhost:5000/api'

async function readErrorMessage(response) {
  try {
    const data = await response.json()
    if (data && typeof data.error === 'string') return data.error
  } catch {
    /* ignore */
  }
  return `Request failed (${response.status})`
}

/**
 * GET /api/parts — all parts as JSON array.
 * @returns {Promise<object[]>}
 */
export async function getParts() {
  const res = await fetch(`${API_BASE}/parts`)
  if (!res.ok) throw new Error(await readErrorMessage(res))
  return res.json()
}

/**
 * POST /api/parts — create a new part.
 * @param {object} body — name, sku, optional category, quantity, threshold, location, notes
 * @returns {Promise<object>} created part
 */
export async function createPart(body) {
  const res = await fetch(`${API_BASE}/parts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await readErrorMessage(res))
  return res.json()
}

/**
 * PUT /api/parts/:id — update all fields.
 * @param {number} id
 * @param {object} body — all seven fields per API contract
 * @returns {Promise<object>} updated part
 */
export async function updatePart(id, body) {
  const res = await fetch(`${API_BASE}/parts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await readErrorMessage(res))
  return res.json()
}

/**
 * DELETE /api/parts/:id
 * @param {number} id
 * @returns {Promise<object>} e.g. { message: 'Part deleted' }
 */
export async function deletePart(id) {
  const res = await fetch(`${API_BASE}/parts/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await readErrorMessage(res))
  return res.json()
}
