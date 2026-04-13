# Architecture Document — Spare Parts Inventory Module

**Author:** Sergio  
**Date:** April 2026  
**Method:** BMAD  
**Version:** 1.0  
**References:** product-brief.md, prd.md  

---

## 1. Overview

This document defines the technical architecture for the Spare Parts Inventory 
Module. It covers the system structure, technology decisions, database schema, 
API design, and frontend component breakdown. This is the primary reference 
document for the Development phase.

---

## 2. System Architecture

The application follows a monolithic architecture with a clear separation 
between frontend and backend. Both run locally and communicate via a REST API.
[ React Frontend : port 5173 ]
|
| HTTP / JSON
|
[ Flask Backend : port 5000 ]
|
| SQLAlchemy ORM
|
[ SQLite DB ]
parts.db

The frontend is a single-page application (SPA) that fetches data from the 
Flask API. Flask serves only JSON — it does not render any HTML templates. 
SQLite stores all data in a single local file with no setup required.

---

## 3. Technology Decisions

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React 18 + Vite | Component-based UI, fast dev server, familiar stack |
| Backend | Flask (Python) | Lightweight, minimal boilerplate, easy REST API setup |
| ORM | SQLAlchemy | Clean database abstraction, handles schema creation simply |
| Database | SQLite | Zero config, file-based, perfect for local single-user app |
| Styling | Plain CSS | No dependencies, keeps focus on BMAD process not UI framework |
| IDE | Cursor | AI-assisted development throughout build phase |

---

## 4. Database Schema

Single table: `parts`
```sql
CREATE TABLE parts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR(100) NOT NULL,
    sku         VARCHAR(50)  NOT NULL UNIQUE,
    category    VARCHAR(50),
    quantity    INTEGER      NOT NULL DEFAULT 0,
    threshold   INTEGER      NOT NULL DEFAULT 5,
    location    VARCHAR(100),
    notes       TEXT,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Key decisions:**
- SKU is unique — enforced at the database level, not just the API
- Threshold defaults to 5 — sensible starting point, always editable
- Single table — no joins needed, keeps queries simple
- Timestamps auto-managed — no manual date handling in application code

---

## 5. API Design

Base URL: `http://localhost:5000/api`

### GET /api/parts
Returns all parts as a JSON array.

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Conveyor Belt",
    "sku": "CB-001",
    "category": "Mechanical",
    "quantity": 3,
    "threshold": 5,
    "location": "Shelf A3",
    "notes": "Check wear monthly",
    "created_at": "2026-04-14T09:00:00",
    "updated_at": "2026-04-14T09:00:00"
  }
]
```
**Response 500:** `{ "error": "Failed to retrieve parts" }`

---

### POST /api/parts
Creates a new part.

**Request body:**
```json
{
  "name": "Conveyor Belt",
  "sku": "CB-001",
  "category": "Mechanical",
  "quantity": 10,
  "threshold": 5,
  "location": "Shelf A3",
  "notes": "Check wear monthly"
}
```

**Response 201:** Returns the created part object  
**Response 400:** `{ "error": "Missing required fields" }`  
**Response 409:** `{ "error": "SKU already exists" }`  
**Response 500:** `{ "error": "Failed to create part" }`  

---

### PUT /api/parts/:id
Updates an existing part by ID.

**Request body:**
```json
{
  "name": "Conveyor Belt v2",
  "sku": "CB-001",
  "category": "Mechanical",
  "quantity": 8,
  "threshold": 5,
  "location": "Shelf B1",
  "notes": "Updated location"
}
```

**Response 200:** Returns the updated part object  
**Response 400:** `{ "error": "Invalid fields" }`  
**Response 404:** `{ "error": "Part not found" }`  
**Response 500:** `{ "error": "Failed to update part" }`  

---

### DELETE /api/parts/:id
Deletes a part by ID.

**Response 200:** `{ "message": "Part deleted" }`  
**Response 404:** `{ "error": "Part not found" }`  
**Response 500:** `{ "error": "Failed to delete part" }`  

---

### Response Code Reference

| Code | Meaning | When used |
|---|---|---|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input, missing fields |
| 404 | Not Found | ID does not exist |
| 409 | Conflict | Duplicate SKU on create |
| 500 | Server Error | Unexpected backend failure |

*In a production API additional codes such as 401 (Unauthorized) 
and 403 (Forbidden) would be added once authentication is introduced.*

---

## 6. Frontend Component Structure
App
├── components/
│   ├── PartsTable        # Main table displaying all parts
│   │   └── PartRow       # Single row, handles low-stock highlight
│   ├── SearchBar         # Real-time filter input
│   ├── AddPartForm       # Form to create a new part
│   ├── EditPartModal     # Modal form to edit an existing part
│   └── DeleteConfirm     # Confirmation dialog before deletion
└── services/
└── api.js            # All fetch calls to Flask backend in one place

**Key decisions:**
- `api.js` centralizes all HTTP calls — easy to debug and update
- `EditPartModal` is a modal so the user never leaves the main table view
- `PartRow` owns the low-stock logic — if quantity ≤ threshold, 
  apply warning style
- No state management library needed — React useState is sufficient 
  for this scope

---

## 7. Data Flow

### Adding a part
User fills AddPartForm
→ POST /api/parts
→ Flask validates fields
→ SQLite inserts record
→ Flask returns new part
→ React appends to parts list
→ Table updates instantly

### Low-stock detection
PartRow receives part as prop
→ if quantity <= threshold
→ apply warning CSS class
→ row highlights red/amber

Low-stock is calculated on the frontend — no extra API call needed.
Every part already has both values from the initial GET request.

---

## 8. Project Folder Structure
spare-parts-inventory/
├── docs/
│   ├── product-brief.md
│   ├── prd.md
│   └── architecture.md
├── backend/
│   ├── app.py            # Flask app entry point
│   ├── models.py         # SQLAlchemy Part model
│   ├── routes.py         # All API route handlers
│   ├── database.py       # DB connection and init
│   └── parts.db          # SQLite database file (auto-created)
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── PartsTable.jsx
│   │   │   ├── PartRow.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── AddPartForm.jsx
│   │   │   ├── EditPartModal.jsx
│   │   │   └── DeleteConfirm.jsx
│   │   └── services/
│   │       └── api.js
│   ├── index.html
│   └── vite.config.js
└── README.md

---

## 9. Local Development Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install flask flask-sqlalchemy flask-cors
python app.py
```

### Frontend
```bash
cd frontend
npm create vite@latest . -- --template react
npm install
npm run dev
```

### CORS
Flask must allow requests from the Vite dev server.
`flask-cors` handles this with one line in `app.py`.

---

## 10. Known Limitations & Future Improvements

- No authentication — single user only, not suitable for production as-is
- SQLite not suitable for concurrent multi-user access
- No input sanitization beyond basic validation
- No unit or integration tests in this version
- Low-stock alert is visual only — no email or push notification
- Response codes would expand to include 401 and 403 
  once authentication is introduced