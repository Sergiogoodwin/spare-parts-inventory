/**
 * Real-time filter input — filters by name or category (PRD F-06).
 * @see docs/architecture.md — SearchBar
 */

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <label htmlFor="parts-search" className="search-bar__label">
        Search
      </label>
      <input
        id="parts-search"
        type="search"
        className="search-bar__input"
        placeholder="Filter by name or category…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
    </div>
  )
}
